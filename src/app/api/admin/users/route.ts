import type { NextRequest } from "next/server";
import { readDb,mutateDb,newId } from "@/lib/db";
import { jsonErr,jsonOk,requireRole } from "@/lib/api";
import { hashPassword } from "@/lib/auth";
import { requireSuperAdminApi,publicAdmin,passwordError,accountFields } from "@/lib/admin-security";
import { recordAdminActivity } from "@/lib/admin-store";
import { isPrimaryAdminEmail } from "@/lib/admin-primary";
export async function GET(req:NextRequest){if(req.nextUrl.searchParams.get("assignable")==="1"){const auth=requireRole(req,"admin");if(!auth.ok)return auth.res;return jsonOk({items:readDb().users.filter(u=>u.role==="admin" && u.active!==false).map(u=>{const safe=publicAdmin(u);return {id:safe.id,name:safe.name,role:safe.role};})},{headers:{"Cache-Control":"no-store"}});}const auth=requireSuperAdminApi(req);if(!auth.ok)return auth.res;return jsonOk({items:readDb().users.filter(u=>u.role==="admin").map(publicAdmin)},{headers:{"Cache-Control":"no-store"}});}
export async function POST(req:NextRequest){
 const auth=requireSuperAdminApi(req);if(!auth.ok)return auth.res;const body=await req.json().catch(()=>null);if(!body || typeof body!=="object")return jsonErr(400,"Invalid request.");
 const fields=accountFields(body);if(!fields)return jsonErr(400,"Enter a name, valid email, username (3–64 letters/numbers/._-) and role.");const error=passwordError(body.password);if(error)return jsonErr(400,error);
 if(isPrimaryAdminEmail(fields.email))return jsonErr(409,"The primary account is reserved.");
 if(readDb().users.some(u=>u.email.toLowerCase()===fields.email || (fields.username && u.username?.toLowerCase()===fields.username)))return jsonErr(409,"Email or username is already in use.");
 const user={id:newId("user"),...fields,passwordHash:hashPassword(body.password),role:"admin" as const,active:true,phone:"",company:"RoadLenz",createdAt:new Date().toISOString()};
 mutateDb(db=>{db.users.push(user);recordAdminActivity(db,auth.session,"created","admin-users",user.id,"Administrator account created.");});return jsonOk({item:publicAdmin(user)},{status:201});
}
