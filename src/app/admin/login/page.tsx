import type {Metadata} from "next";
import Link from "next/link";
import {redirect} from "next/navigation";
import {getCurrentAdmin} from "@/lib/admin-auth";
import AdminLoginForm from "@/components/admin/AdminLoginForm";
export const metadata:Metadata={title:"Administration Console | RoadLenz",robots:{index:false,follow:false}};
export default async function AdminLoginPage(){if(await getCurrentAdmin())redirect("/admin");return <main className="flex min-h-screen items-center justify-center bg-[#07182d] px-5 py-12"><section className="w-full max-w-md rounded-xl border border-slate-200 bg-white p-8 shadow-xl"><Link href="/" className="text-2xl font-extrabold tracking-tight text-[#123d63]">ROADLENZ</Link><h1 className="mt-3 text-xl font-semibold text-slate-900">Administration Console</h1><p className="mt-2 text-sm text-slate-500">Sign in to manage RoadLenz operations.</p><AdminLoginForm/><Link href="/" className="mt-6 block text-center text-xs font-semibold text-blue-700">Back to website</Link></section></main>;}
