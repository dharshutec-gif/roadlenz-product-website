import "server-only";
import { redirect } from "next/navigation";
import { getCurrentSession } from "./auth";
import { isPrimaryAdminEmail } from "./admin-primary";
export type CurrentAdmin={id:string;name:string;email:string;role:"ADMIN"|"SUPER_ADMIN";active:true;lastLoginAt:string|null};
export async function getCurrentAdmin():Promise<CurrentAdmin|null>{const s=await getCurrentSession();if(!s || s.role!=="admin")return null;return {id:s.userId,name:s.name,email:s.email,role:isPrimaryAdminEmail(s.email)?"SUPER_ADMIN":s.adminRole || "ADMIN",active:true,lastLoginAt:s.lastLoginAt || null};}
export const getAdminSession=getCurrentAdmin;
export async function requireAdmin():Promise<CurrentAdmin>{const admin=await getCurrentAdmin();if(!admin)redirect("/admin/login");return admin;}
export async function requireSuperAdmin():Promise<CurrentAdmin>{const admin=await requireAdmin();if(admin.role!=="SUPER_ADMIN")redirect("/admin");return admin;}
