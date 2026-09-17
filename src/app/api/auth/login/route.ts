import { NextRequest, NextResponse } from "next/server";
import { readDb, mutateDb } from "@/lib/db";
import { verifyPassword, createSession, setSessionCookie } from "@/lib/auth";
import { ensurePrimaryAdmin } from "@/lib/admin-primary";
import { recordAdminActivity } from "@/lib/admin-store";
export async function POST(req:NextRequest){
 const body=await req.json().catch(()=>null);
 const identifier=String(body?.identifier ?? body?.email ?? "").trim().toLowerCase();const password=String(body?.password ?? "");
 if(!identifier || !password || identifier.length>254 || password.length>1024)return NextResponse.json({error:"Username/email and password are required."},{status:400});
 if(body?.intent==="admin"){try{ensurePrimaryAdmin();}catch{return NextResponse.json({error:"Administrator sign-in is temporarily unavailable."},{status:503});}}
 const user=readDb().users.find(u=>u.email.toLowerCase()===identifier || (body?.intent==="admin" && u.role==="admin" && u.username?.toLowerCase()===identifier));
 if(!user || user.active===false || !verifyPassword(password,user.passwordHash) || (body?.intent==="admin" && user.role!=="admin")){
  if(body?.intent==="admin")mutateDb(db=>recordAdminActivity(db,{userId:user?.id || "anonymous",name:user?.name || "Unknown account"},"login-failed","security",user?.id || "","Administrator sign-in failed."));
  return NextResponse.json({error:"Invalid credentials or account unavailable."},{status:401});
 }
 mutateDb(db=>{db.users.find(u=>u.id===user.id)!.lastLoginAt=new Date().toISOString();if(user.role==="customer")recordAdminActivity(db,{userId:user.id,name:user.name},"customer-login","customers",user.id,"Customer signed in.");if(user.role==="admin")recordAdminActivity(db,{userId:user.id,name:user.name},"login","security",user.id,"Administrator signed in.");});
 const token=createSession(user.id,user.role);const res=NextResponse.json({ok:true,role:user.role,name:user.name});const cookie=setSessionCookie(token);res.cookies.set(body?.remember===false ? {...cookie,maxAge:undefined}:cookie);return res;
}
