import type { NextRequest } from "next/server";
import { readDb,mutateDb } from "@/lib/db";
import { requireRole,jsonOk,jsonErr } from "@/lib/api";
import { verifyPassword,hashPassword,clearSessionCookie } from "@/lib/auth";
import { publicAdmin,passwordError } from "@/lib/admin-security";
import { isPrimaryAdminEmail } from "@/lib/admin-primary";
import { adminStore,recordAdminActivity } from "@/lib/admin-store";
export async function GET(req:NextRequest){const auth=requireRole(req,"admin");if(!auth.ok)return auth.res;const db=readDb();const user=db.users.find(u=>u.id===auth.session.userId)!;return jsonOk({account:publicAdmin(user),sessions:db.sessions.filter(s=>s.userId===user.id && new Date(s.expiresAt).getTime()>Date.now()).map(s=>({createdAt:s.createdAt,expiresAt:s.expiresAt,current:s.token===req.cookies.get("rl_session")?.value})),activity:adminStore(db).activity.filter(a=>["security","admin-users"].includes(a.module) && (isPrimaryAdminEmail(user.email) || user.adminRole==="SUPER_ADMIN" || a.actorId===user.id || a.recordId===user.id)).slice(-50).reverse()},{headers:{"Cache-Control":"no-store"}});}
export async function POST(req:NextRequest){
 const auth=requireRole(req,"admin");if(!auth.ok)return auth.res;const body=await req.json().catch(()=>null);if(!body)return jsonErr(400,"Invalid request.");const user=readDb().users.find(u=>u.id===auth.session.userId)!;
 if(body.action==="change-password"){
  if(isPrimaryAdminEmail(user.email))return jsonErr(403,"The primary password is managed in server environment configuration. Ask the server operator to rotate it; existing sessions are revoked on the next administrator sign-in.");
  if(typeof body.currentPassword!=="string" || !verifyPassword(body.currentPassword,user.passwordHash))return jsonErr(400,"Current password is incorrect.");const error=passwordError(body.newPassword);if(error)return jsonErr(400,error);if(body.newPassword!==body.confirmPassword)return jsonErr(400,"New passwords do not match.");if(verifyPassword(body.newPassword,user.passwordHash))return jsonErr(400,"Choose a different password.");
 }else if(body.action!=="logout-all")return jsonErr(400,"Unknown security action.");
 mutateDb(db=>{if(body.action==="change-password")db.users.find(u=>u.id===user.id)!.passwordHash=hashPassword(body.newPassword);db.sessions=db.sessions.filter(s=>s.userId!==user.id);recordAdminActivity(db,auth.session,body.action,"security",user.id,body.action==="change-password"?"Password changed; all sessions revoked.":"All account sessions revoked.");});const res=jsonOk({ok:true,reauthenticate:true});res.cookies.set(clearSessionCookie());return res;
}
