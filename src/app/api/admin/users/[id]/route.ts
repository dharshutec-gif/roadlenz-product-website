import type { NextRequest } from "next/server";
import { readDb,mutateDb } from "@/lib/db";
import { jsonErr,jsonOk } from "@/lib/api";
import { hashPassword } from "@/lib/auth";
import { requireSuperAdminApi,publicAdmin,passwordError,accountFields } from "@/lib/admin-security";
import { isPrimaryAdminEmail } from "@/lib/admin-primary";
import { recordAdminActivity } from "@/lib/admin-store";
type Context={params:Promise<{id:string}>};
export async function PATCH(req:NextRequest,context:Context){
 const auth=requireSuperAdminApi(req);if(!auth.ok)return auth.res;const {id}=await context.params;const user=readDb().users.find(u=>u.id===id && u.role==="admin");if(!user)return jsonErr(404,"Administrator not found.");
 const body=await req.json().catch(()=>null);if(!body || typeof body!=="object")return jsonErr(400,"Invalid request.");if(isPrimaryAdminEmail(user.email))return jsonErr(403,"The primary Super Admin is managed by server configuration.");
 const fields=accountFields({...publicAdmin(user),...body});if(!fields)return jsonErr(400,"Invalid account fields.");if(body.active!==undefined && typeof body.active!=="boolean")return jsonErr(400,"Invalid account status.");
 if(id===auth.session.userId && (body.active===false || fields.adminRole!=="SUPER_ADMIN"))return jsonErr(400,"You cannot disable or downgrade your own account.");
 if(isPrimaryAdminEmail(fields.email) || readDb().users.some(u=>u.id!==id && (u.email.toLowerCase()===fields.email || (fields.username && u.username?.toLowerCase()===fields.username))))return jsonErr(409,"Email or username is reserved or in use.");
 if(body.password!==undefined){const error=passwordError(body.password);if(error)return jsonErr(400,error);}
 mutateDb(db=>{const target=db.users.find(u=>u.id===id)!;Object.assign(target,fields);if(body.active!==undefined)target.active=body.active;if(body.password!==undefined)target.passwordHash=hashPassword(body.password);db.sessions=db.sessions.filter(s=>s.userId!==id);recordAdminActivity(db,auth.session,body.password!==undefined?"password-reset":body.active===false?"disabled":"updated","admin-users",id,"Administrator account updated; existing sessions revoked.");});
 return jsonOk({item:publicAdmin(readDb().users.find(u=>u.id===id)!)});
}
export async function DELETE(req:NextRequest,context:Context){const auth=requireSuperAdminApi(req);if(!auth.ok)return auth.res;const {id}=await context.params;const user=readDb().users.find(u=>u.id===id && u.role==="admin");if(!user)return jsonErr(404,"Administrator not found.");if(isPrimaryAdminEmail(user.email) || id===auth.session.userId)return jsonErr(403,"The primary account and your own account cannot be deleted.");mutateDb(db=>{db.users=db.users.filter(u=>u.id!==id);db.sessions=db.sessions.filter(s=>s.userId!==id);recordAdminActivity(db,auth.session,"deleted","admin-users",id,"Administrator account deleted.");});return jsonOk({ok:true});}
