import "server-only";
import { hashPassword, verifyPassword } from "./auth";
import { mutateDb, newId, readDb } from "./db";
export function isPrimaryAdminEmail(email: string): boolean {
 return email.trim().toLowerCase() === (process.env.ROADLENZ_SUPERADMIN_EMAIL?.trim().toLowerCase() || "superadmin@roadlenz.local");
}
/** Server-only provisioning. The primary password is deliberately environment-managed. */
export function ensurePrimaryAdmin() {
 const username=process.env.ROADLENZ_SUPERADMIN_USERNAME?.trim().toLowerCase() || "superadmin";
 const email=process.env.ROADLENZ_SUPERADMIN_EMAIL?.trim().toLowerCase() || "superadmin@roadlenz.local";
 const name=process.env.ROADLENZ_SUPERADMIN_NAME?.trim() || "RoadLenz Super Admin";
 const password=process.env.ROADLENZ_SUPERADMIN_PASSWORD || "";
 if(password.length<8 || username.length<3 || !email.includes("@"))throw new Error("Primary administrator configuration is unavailable.");
 const current=readDb().users.find(u=>isPrimaryAdminEmail(u.email));
 if(!current || current.username!==username || current.name!==name || current.role!=="admin" || current.adminRole!=="SUPER_ADMIN" || current.active===false || !verifyPassword(password,current.passwordHash))mutateDb(db=>{
  const user=db.users.find(u=>isPrimaryAdminEmail(u.email));
  if(!user)db.users.push({id:newId("user"),name,email,username,passwordHash:hashPassword(password),role:"admin",adminRole:"SUPER_ADMIN",active:true,company:"RoadLenz Intelligent Mobility",phone:"",createdAt:new Date().toISOString()});
  else {if(!verifyPassword(password,user.passwordHash)){user.passwordHash=hashPassword(password);db.sessions=db.sessions.filter(s=>s.userId!==user.id);}Object.assign(user,{name,username,role:"admin",adminRole:"SUPER_ADMIN",active:true});}
 });
}
