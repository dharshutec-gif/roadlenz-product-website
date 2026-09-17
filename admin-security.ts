import "server-only";
import type { NextRequest } from "next/server";
import type { AppUser } from "./types";
import { requireRole,jsonErr } from "./api";
import { isPrimaryAdminEmail } from "./admin-primary";
export function requireSuperAdminApi(req:NextRequest){const auth=requireRole(req,"admin");if(!auth.ok)return auth;if(!isPrimaryAdminEmail(auth.session.email) && auth.session.adminRole!=="SUPER_ADMIN")return {ok:false as const,res:jsonErr(403,"Only Super Admins can manage administrators.")};return auth;}
export function publicAdmin(u:AppUser){return {id:u.id,name:u.name,email:u.email,username:u.username || "",role:isPrimaryAdminEmail(u.email)?"SUPER_ADMIN":u.adminRole || "ADMIN",active:u.active!==false,lastLoginAt:u.lastLoginAt || null,createdAt:u.createdAt,primary:isPrimaryAdminEmail(u.email)};}
export function passwordError(p:unknown):string|null{return typeof p!=="string" || p.length<12 || p.length>128 || !/[a-z]/.test(p) || !/[A-Z]/.test(p) || !/[0-9]/.test(p) || !/[^A-Za-z0-9]/.test(p)?"Use 12–128 characters with uppercase, lowercase, a number and a symbol.":null;}
export function accountFields(body:Record<string,unknown>){
 const name=typeof body.name==="string"?body.name.trim():"";const email=typeof body.email==="string"?body.email.trim().toLowerCase():"";const username=typeof body.username==="string"?body.username.trim().toLowerCase():"";const adminRole=body.role==="SUPER_ADMIN"?"SUPER_ADMIN" as const:"ADMIN" as const;
 if(!name || name.length>120 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length>254 || (username && !/^[a-z0-9._-]{3,64}$/.test(username)) || (body.role!==undefined && !["ADMIN","SUPER_ADMIN"].includes(String(body.role))))return null;return {name,email,username,adminRole};
}
