"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Icon, Logo, SmartImage } from "../ui";
import type {
  CustomerAddress,
  CustomerInvoice,
  CustomerOrder,
  CustomerOrderStatus,
  CustomerProfile,
  Product,
} from "./types";

type Tab = "overview" | "orders" | "quotes" | "saved" | "documents" | "profile" | "support" | "security" | "notifications";

type CustomerPayload = {
  profile: CustomerProfile | null;
  products: Product[];
  orders: CustomerOrder[];
  invoices: CustomerInvoice[];
};

async function readApiBody(response: Response): Promise<Record<string, any>> {
  const text = await response.text();

  if (!text.trim()) {
    return {};
  }

  try {
    const parsed = JSON.parse(text);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

const TABS: { id: Tab; label: string; icon: string }[] = [
  { id: "overview", label: "Overview", icon: "gauge" },
  { id: "orders", label: "My Orders", icon: "box" },
  { id: "quotes", label: "Quotations", icon: "doc" },
  { id: "saved", label: "Saved Products", icon: "heart" },
  { id: "documents", label: "Invoices & Documents", icon: "download" },
  { id: "profile", label: "Profile & Addresses", icon: "users" },
  { id: "support", label: "Support", icon: "headset" },
  { id: "security", label: "Security", icon: "shield" },
  { id: "notifications", label: "Notifications", icon: "bell" },
];

const ORDER_STATUSES: CustomerOrderStatus[] = ["pending", "confirmed", "processing", "shipped", "delivered", "cancelled"];
const TRACK_STEPS: CustomerOrderStatus[] = ["confirmed", "processing", "shipped", "delivered"];
const money = (value: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
const formatDate = (value?: string) => value ? new Intl.DateTimeFormat("en-IN", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(value)) : "—";

const statusTone: Record<string, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-blue-50 text-blue-700 border-blue-200",
  confirmed: "bg-blue-50 text-blue-700 border-blue-200",
  processing: "bg-amber-50 text-amber-700 border-amber-200",
  shipped: "bg-sky-50 text-sky-700 border-sky-200",
  delivered: "bg-emerald-50 text-emerald-700 border-emerald-200",
  cancelled: "bg-red-50 text-red-700 border-red-200",
  paid: "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed: "bg-red-50 text-red-700 border-red-200",
  refunded: "bg-violet-50 text-violet-700 border-violet-200",
  open: "bg-blue-50 text-blue-700 border-blue-200",
  "in-progress": "bg-amber-50 text-amber-700 border-amber-200",
  resolved: "bg-emerald-50 text-emerald-700 border-emerald-200",
  active: "bg-emerald-50 text-emerald-700 border-emerald-200",
  expiring: "bg-amber-50 text-amber-700 border-amber-200",
  expired: "bg-red-50 text-red-700 border-red-200",
};

function Status({ value }: { value: string }) {
  return <span className={`inline-flex rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${statusTone[value] ?? "border-slate-200 bg-slate-50 text-slate-600"}`}>{value.replaceAll("-", " ")}</span>;
}

function Panel({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`rounded-2xl border border-slate-200 bg-white shadow-sm ${className}`}>{children}</section>;
}

function EmptyState({ icon, title, text, action }: { icon: string; title: string; text: string; action?: React.ReactNode }) {
  return <div className="px-6 py-12 text-center"><span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-slate-50 text-slate-300"><Icon name={icon} className="h-6 w-6"/></span><h3 className="mt-4 font-extrabold text-slate-800">{title}</h3><p className="mx-auto mt-1 max-w-md text-sm leading-6 text-slate-500">{text}</p>{action ? <div className="mt-5">{action}</div> : null}</div>;
}

function OrderTimeline({ order }: { order: CustomerOrder }) {
  if (order.status === "cancelled" || order.status === "pending") return <div className={`rounded-xl p-3 text-sm font-semibold ${order.status === "cancelled" ? "bg-red-50 text-red-700" : "bg-amber-50 text-amber-700"}`}>{order.status === "cancelled" ? "This order was cancelled." : "Order received. Confirmation will appear here once processing begins."}</div>;
  const activeIndex = TRACK_STEPS.indexOf(order.status);
  return <div className="grid grid-cols-4 gap-1">{TRACK_STEPS.map((step,index)=><div key={step} className="relative text-center"><div className={`mx-auto flex h-7 w-7 items-center justify-center rounded-full border-2 text-[10px] font-black ${index<=activeIndex ? "border-blue-600 bg-blue-600 text-white" : "border-slate-200 bg-white text-slate-300"}`}>{index<activeIndex ? <Icon name="check" className="h-3.5 w-3.5"/> : index+1}</div><p className={`mt-2 text-[10px] font-bold capitalize ${index<=activeIndex ? "text-slate-800" : "text-slate-400"}`}>{step}</p>{index<TRACK_STEPS.length-1&&<span className={`absolute left-[calc(50%+16px)] right-[calc(-50%+16px)] top-[13px] h-0.5 ${index<activeIndex ? "bg-blue-600" : "bg-slate-200"}`}/>}</div>)}</div>;
}

export default function CustomerWorkspace({ initialName }: { initialName: string }) {
  const router = useRouter();
  const reduce = useReducedMotion();
  const [data, setData] = useState<CustomerPayload>({ profile: null, products: [], orders: [], invoices: [] });
  const [tab, setTab] = useState<Tab>("overview");
  const [navOpen, setNavOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatus, setOrderStatus] = useState<string>("all");
  const [ticketForm, setTicketForm] = useState({ subject: "", description: "" });
  const [ticketBusy, setTicketBusy] = useState(false);
  const [profileBusy, setProfileBusy] = useState(false);
  const [passwordBusy, setPasswordBusy] = useState(false);
  const [profileDraft, setProfileDraft] = useState({ name: "", company: "", phone: "" });
  const [addressDrafts, setAddressDrafts] = useState<CustomerAddress[]>([]);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });

  const flash = (message: string) => { setToast(message); window.setTimeout(() => setToast(""), 2600); };
  const load = useCallback(async () => {
    setError("");
    try {
      const response = await fetch("/api/customer", { cache: "no-store" });
      if (response.status === 401) { router.push("/customer-login"); return; }
      const body = await readApiBody(response);
      if (!response.ok) throw new Error(body.error || "Could not load your account.");
      const next: CustomerPayload = { profile: body.profile ?? null, products: body.products ?? [], orders: body.orders ?? [], invoices: body.invoices ?? [] };
      setData(next);
      if (next.profile) { setProfileDraft({ name: next.profile.name, company: next.profile.company, phone: next.profile.phone }); setAddressDrafts(next.profile.addresses ?? []); }
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Could not load your account."); }
    finally { setLoading(false); }
  }, [router]);
  useEffect(()=>{ load(); },[load]);

  const profile = data.profile;
  const unread = profile?.notifications.filter((item)=>!item.read).length ?? 0;
  const savedProducts = useMemo(() => profile ? data.products.filter((product)=>profile.savedProductSlugs.includes(product.slug)) : [], [profile, data.products]);
  const productMap = useMemo(() => new Map(data.products.map((product)=>[product.slug,product])), [data.products]);
  const latestOrder = data.orders[0];
  const filteredOrders = useMemo(() => data.orders.filter((order)=>{
    if (orderStatus !== "all" && order.status !== orderStatus) return false;
    const needle = orderQuery.trim().toLowerCase();
    return !needle || order.orderNumber.toLowerCase().includes(needle) || order.items.some((item)=>item.name.toLowerCase().includes(needle));
  }),[data.orders,orderQuery,orderStatus]);

  const registeredDocs = useMemo(() => profile ? profile.registeredProducts.flatMap((registered)=>{
    const product = productMap.get(registered.productSlug);
    return (product?.documents ?? []).map((document)=>({ ...document, product: product?.name ?? registered.productSlug, serial: registered.serial }));
  }) : [], [profile, productMap]);

  const logout = async () => { await fetch("/api/auth/logout",{method:"POST"}); router.push("/customer-login"); router.refresh(); };
  const selectTab = (value: Tab) => { setTab(value); setNavOpen(false); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const toggleSave = async (slug: string) => { const response = await fetch("/api/customer/save",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({slug})}); const body = await readApiBody(response); if (!response.ok) return flash(body.error || "Could not update saved products."); flash(body.saved ? "Product saved" : "Product removed"); await load(); };
  const markRead = async () => { await fetch("/api/customer/notifications",{method:"POST"}); await load(); };
  const createTicket = async (event: React.FormEvent) => { event.preventDefault(); if(!ticketForm.subject.trim()||!ticketForm.description.trim()) return; setTicketBusy(true); const response=await fetch("/api/customer/ticket",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(ticketForm)}); const body=await readApiBody(response); setTicketBusy(false); if(!response.ok) return flash(body.error||"Could not create ticket."); setTicketForm({subject:"",description:""}); flash(`Ticket ${body.ref} created`); await load(); };
  const saveProfile = async () => { setProfileBusy(true); const response=await fetch("/api/customer/profile",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({...profileDraft,addresses:addressDrafts})}); const body=await readApiBody(response); setProfileBusy(false); if(!response.ok) return flash(body.error||"Could not save profile."); flash("Profile updated"); await load(); };
  const changePassword = async (event: React.FormEvent) => { event.preventDefault(); if(passwordForm.newPassword!==passwordForm.confirmPassword) return flash("New passwords do not match"); setPasswordBusy(true); const response=await fetch("/api/customer/password",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({currentPassword:passwordForm.currentPassword,newPassword:passwordForm.newPassword})}); const body=await readApiBody(response); setPasswordBusy(false); if(!response.ok) return flash(body.error||"Could not change password."); setPasswordForm({currentPassword:"",newPassword:"",confirmPassword:""}); flash("Password changed"); };

  if (loading) return <div className="flex min-h-[100svh] items-center justify-center bg-[#f4f7fb] pt-[72px]"><div className="text-center"><span className="mx-auto block h-9 w-9 animate-spin rounded-full border-[3px] border-blue-100 border-t-blue-600"/><p className="mt-3 text-sm font-semibold text-slate-500">Loading your RoadLenz account…</p></div></div>;
  if (error || !profile) return <div className="flex min-h-[100svh] items-center justify-center bg-[#f4f7fb] px-5 pt-[72px]"><Panel className="max-w-md p-8 text-center"><Icon name="alert" className="mx-auto h-8 w-8 text-red-500"/><h2 className="mt-4 font-black text-slate-900">Account unavailable</h2><p className="mt-2 text-sm text-slate-500">{error || "No customer profile is connected to this login."}</p><button onClick={()=>{setLoading(true);load();}} className="mt-5 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">Try again</button></Panel></div>;

  const accountCards: { id: Tab; label: string; text: string; icon: string }[] = [
    {id:"orders",label:"Your Orders",text:"Track and manage orders",icon:"box"}, {id:"quotes",label:"Quotations",text:"Review quote requests",icon:"doc"}, {id:"saved",label:"Saved Products",text:"Products you shortlisted",icon:"heart"}, {id:"documents",label:"Invoices & Documents",text:"View available files",icon:"download"}, {id:"profile",label:"Profile & Addresses",text:"Manage account details",icon:"users"}, {id:"security",label:"Security",text:"Password and access",icon:"shield"}, {id:"support",label:"Customer Support",text:"Technical and installation help",icon:"headset"}, {id:"notifications",label:"Notifications",text:"Account updates",icon:"bell"},
  ];

  return <div className="min-h-screen bg-[#f4f7fb] pt-[72px] text-slate-900">
    {toast && <div className="fixed right-4 top-[88px] z-[150] rounded-xl bg-slate-950 px-4 py-3 text-sm font-bold text-white shadow-2xl">{toast}</div>}
    {navOpen && <button onClick={()=>setNavOpen(false)} aria-label="Close account navigation" className="fixed inset-0 z-40 bg-slate-950/35 lg:hidden"/>}
    <div className="border-b border-slate-200 bg-white"><div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-4 py-4 sm:px-6 xl:px-8"><Link href="/"><Logo/></Link><div className="hidden flex-1 justify-center md:flex"><p className="text-xs font-semibold text-slate-400">Secure RoadLenz customer account</p></div><div className="flex items-center gap-2"><Link href="/products" className="hidden rounded-xl px-3 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50 sm:inline-flex">Shop Products</Link><button onClick={()=>selectTab("notifications")} className="relative rounded-xl border border-slate-200 p-2.5"><Icon name="bell" className="h-4 w-4"/>{unread>0&&<span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[9px] font-black text-white">{unread}</span>}</button><button onClick={()=>setNavOpen(true)} className="rounded-xl border border-slate-200 p-2.5 lg:hidden"><Icon name="menu" className="h-4 w-4"/></button></div></div></div>

    <div className="mx-auto grid max-w-[1500px] lg:grid-cols-[240px_1fr]">
      <aside className={`fixed bottom-0 left-0 top-[145px] z-50 w-[270px] overflow-y-auto border-r border-slate-200 bg-white p-4 transition-transform ${navOpen?"translate-x-0":"-translate-x-full"} lg:sticky lg:top-[72px] lg:z-auto lg:h-[calc(100vh-72px)] lg:w-auto lg:translate-x-0`}>
        <div className="rounded-2xl bg-[#07182e] p-4 text-white"><div className="flex items-center gap-3"><span className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-600 text-sm font-black">{profile.name.slice(0,1).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-sm font-black">{profile.name}</p><p className="truncate text-[11px] text-slate-300">{profile.company || profile.email}</p></div></div></div>
        <nav className="mt-4 space-y-1">{TABS.map((item)=><button key={item.id} onClick={()=>selectTab(item.id)} className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold transition ${tab===item.id?"bg-blue-50 text-blue-700":"text-slate-600 hover:bg-slate-50 hover:text-slate-900"}`}><Icon name={item.icon} className="h-4 w-4"/><span className="flex-1">{item.label}</span>{item.id==="notifications"&&unread>0?<span className="rounded-full bg-red-500 px-1.5 py-0.5 text-[9px] text-white">{unread}</span>:null}</button>)}</nav>
        <div className="mt-5 border-t border-slate-100 pt-4"><Link href="/products" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50"><Icon name="external" className="h-4 w-4"/>Browse products</Link>{profile.fleetPlatformUrl?<a href={profile.fleetPlatformUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13px] font-bold text-slate-600 hover:bg-slate-50"><Icon name="route" className="h-4 w-4"/>Fleet platform</a>:null}<button onClick={logout} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-[13px] font-bold text-red-600 hover:bg-red-50"><Icon name="logout" className="h-4 w-4"/>Logout</button></div>
      </aside>

      <main className="min-w-0 px-4 py-6 sm:px-6 lg:py-8 xl:px-8">
        <AnimatePresence mode="wait"><motion.div key={tab} initial={reduce?false:{opacity:0,y:8}} animate={{opacity:1,y:0}} exit={reduce?undefined:{opacity:0,y:-4}} transition={{duration:.2}}>
          {tab === "overview" && <div className="space-y-6">
            <div className="overflow-hidden rounded-2xl bg-[#0b2b50] text-white shadow-sm"><div className="relative p-6 sm:p-8"><div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_30%,rgba(44,177,255,.32),transparent_28%)]"/><div className="relative"><p className="text-xs font-bold uppercase tracking-[.18em] text-cyan-300">My Account</p><h1 className="mt-2 text-2xl font-black sm:text-3xl">Hello, {profile.name.split(" ")[0]}</h1><p className="mt-2 max-w-xl text-sm leading-6 text-slate-200">Manage your RoadLenz orders, quotations, product documents and support from one account.</p></div></div></div>

            {latestOrder ? <Panel><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><div><h2 className="font-black text-slate-900">Recent order</h2><p className="text-xs text-slate-500">{latestOrder.orderNumber} · Ordered {formatDate(latestOrder.createdAt)}</p></div><Status value={latestOrder.status}/></div><div className="grid gap-5 p-5 lg:grid-cols-[1fr_320px]"> <div className="space-y-3">{latestOrder.items.slice(0,3).map((item)=><div key={item.productSlug} className="flex items-center gap-3"><div className="h-16 w-16 overflow-hidden rounded-xl bg-slate-50">{item.image?<img src={item.image} alt="" className="h-full w-full object-contain p-1"/>:<span className="flex h-full items-center justify-center"><Icon name="box" className="text-slate-300"/></span>}</div><div><p className="font-bold text-slate-900">{item.name}</p><p className="text-xs text-slate-500">Qty {item.quantity}</p><p className="mt-1 text-sm font-black text-slate-900">{money(item.unitAmount*item.quantity)}</p></div></div>)}</div><div className="rounded-xl bg-slate-50 p-4"><OrderTimeline order={latestOrder}/><p className="mt-4 text-sm font-black text-slate-900">Total {money(latestOrder.total)}</p>{latestOrder.expectedDelivery?<p className="mt-1 text-xs text-slate-500">Expected delivery: {formatDate(latestOrder.expectedDelivery)}</p>:null}<button onClick={()=>selectTab("orders")} className="mt-4 w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">View / Track Order</button></div></div></Panel> : <Panel><EmptyState icon="box" title="No orders yet" text="When you place an order, it will appear here automatically." action={<Link href="/products" className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">Browse Products</Link>}/></Panel>}

            <div><h2 className="mb-3 text-lg font-black text-slate-900">Your account</h2><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">{accountCards.map((card)=><button key={card.id} onClick={()=>selectTab(card.id)} className="group rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700 group-hover:bg-blue-600 group-hover:text-white"><Icon name={card.icon} className="h-5 w-5"/></span><p className="mt-4 font-extrabold text-slate-900">{card.label}</p><p className="mt-1 text-xs leading-5 text-slate-500">{card.text}</p></button>)}</div></div>

            <div className="grid gap-6 xl:grid-cols-2"><Panel><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="font-black">Recent quotations</h2><button onClick={()=>selectTab("quotes")} className="text-xs font-bold text-blue-700">View all</button></div>{profile.quotes.length?<div className="divide-y divide-slate-100">{[...profile.quotes].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).slice(0,3).map((quote)=><div key={quote.id} className="flex items-center justify-between gap-4 px-5 py-4"><div><p className="text-sm font-bold text-slate-900">{quote.ref}</p><p className="mt-1 line-clamp-1 text-xs text-slate-500">{quote.item}</p></div><div className="text-right"><Status value={quote.status}/><p className="mt-1 text-xs font-semibold text-slate-500">{quote.amount}</p></div></div>)}</div>:<EmptyState icon="doc" title="No quotations yet" text="Quotation requests linked to your account will appear here."/>}</Panel><Panel><div className="flex items-center justify-between border-b border-slate-100 px-5 py-4"><h2 className="font-black">Invoices & documents</h2><button onClick={()=>selectTab("documents")} className="text-xs font-bold text-blue-700">View all</button></div>{data.invoices.length||registeredDocs.length?<div className="divide-y divide-slate-100">{data.invoices.slice(0,2).map((invoice)=><div key={invoice.id} className="flex items-center justify-between gap-3 px-5 py-4"><div><p className="text-sm font-bold">{invoice.invoiceNumber}</p><p className="text-xs text-slate-500">{formatDate(invoice.createdAt)} · {money(invoice.amount)}</p></div>{invoice.pdfUrl?<a href={invoice.pdfUrl} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700">Download</a>:<span className="text-xs text-slate-400">Not available</span>}</div>)}{registeredDocs.slice(0,2).map((doc,index)=><div key={`${doc.url}-${index}`} className="flex items-center justify-between gap-3 px-5 py-4"><div><p className="text-sm font-bold">{doc.name}</p><p className="text-xs text-slate-500">{doc.product}</p></div><a href={doc.url} target="_blank" rel="noreferrer" className="text-xs font-bold text-blue-700">Open</a></div>)}</div>:<EmptyState icon="download" title="No documents available yet" text="Invoices and product documents will appear here when generated or assigned."/>}</Panel></div>
          </div>}

          {tab === "orders" && <div className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Purchases</p><h1 className="mt-1 text-2xl font-black">My Orders</h1><p className="mt-1 text-sm text-slate-500">Track and review every order linked to your account.</p></div><div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:flex-row"><div className="relative flex-1"><Icon name="search" className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"/><input value={orderQuery} onChange={(e)=>setOrderQuery(e.target.value)} placeholder="Search orders or products" className="w-full rounded-xl border border-slate-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-400"/></div><select value={orderStatus} onChange={(e)=>setOrderStatus(e.target.value)} className="rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold"><option value="all">All orders</option>{ORDER_STATUSES.map((item)=><option key={item}>{item}</option>)}</select></div>{filteredOrders.length?<div className="space-y-4">{filteredOrders.map((order)=><Panel key={order.id}><div className="grid gap-3 border-b border-slate-100 bg-slate-50/70 px-5 py-3 text-xs sm:grid-cols-[1fr_1fr_auto]"><div><p className="font-bold uppercase text-slate-400">Order placed</p><p className="mt-1 font-semibold text-slate-700">{formatDate(order.createdAt)}</p></div><div><p className="font-bold uppercase text-slate-400">Total</p><p className="mt-1 font-black text-slate-900">{money(order.total)}</p></div><div className="sm:text-right"><p className="font-bold uppercase text-slate-400">Order</p><p className="mt-1 font-bold text-blue-700">{order.orderNumber}</p></div></div><div className="grid gap-5 p-5 xl:grid-cols-[1fr_340px]"><div className="space-y-4">{order.items.map((item)=><div key={item.productSlug} className="flex gap-4"><div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-slate-50">{item.image?<img src={item.image} alt="" className="h-full w-full object-contain p-2"/>:<span className="flex h-full items-center justify-center"><Icon name="box" className="text-slate-300"/></span>}</div><div><p className="font-extrabold text-slate-900">{item.name}</p><p className="mt-1 text-xs text-slate-500">Quantity: {item.quantity}</p><p className="mt-1 text-sm font-black">{money(item.unitAmount*item.quantity)}</p><Link href={`/products/${item.productSlug}`} className="mt-2 inline-block text-xs font-bold text-blue-700">View product</Link></div></div>)}</div><div className="rounded-xl border border-slate-100 bg-slate-50 p-4"><div className="flex items-center justify-between"><Status value={order.status}/><Status value={order.paymentStatus}/></div><div className="mt-5"><OrderTimeline order={order}/></div>{order.trackingNumber?<div className="mt-5 rounded-lg bg-white p-3 text-xs"><p className="font-bold text-slate-900">Tracking: {order.trackingNumber}</p><p className="mt-1 text-slate-500">{order.courier || "Courier"}</p></div>:order.status==="shipped"?<p className="mt-5 text-xs text-slate-500">Tracking information will appear when it is available.</p>:null}{order.expectedDelivery?<p className="mt-4 text-xs font-semibold text-slate-600">Expected delivery: {formatDate(order.expectedDelivery)}</p>:null}<button onClick={()=>selectTab("support")} className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-xs font-bold text-slate-700">Get Support</button></div></div></Panel>)}</div>:<Panel><EmptyState icon="box" title="No matching orders" text={data.orders.length ? "Try a different search or status filter." : "When you place an order, you can track it here."} action={!data.orders.length?<Link href="/products" className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">Browse Products</Link>:undefined}/></Panel>}</div>}

          {tab === "quotes" && <div className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Requests</p><h1 className="mt-1 text-2xl font-black">My Quotations</h1><p className="mt-1 text-sm text-slate-500">Quotation requests and responses connected to your account.</p></div><Panel>{profile.quotes.length?<div className="divide-y divide-slate-100">{[...profile.quotes].sort((a,b)=>b.createdAt.localeCompare(a.createdAt)).map((quote)=><div key={quote.id} className="grid gap-4 px-5 py-5 sm:grid-cols-[150px_1fr_auto] sm:items-center"><div><p className="font-black text-slate-900">{quote.ref}</p><p className="mt-1 text-xs text-slate-400">{formatDate(quote.createdAt)}</p></div><div><p className="font-bold text-slate-800">{quote.item}</p><p className="mt-1 text-xs text-slate-500">Quantity: {quote.qty}</p></div><div className="sm:text-right"><Status value={quote.status}/><p className="mt-2 text-sm font-black text-slate-900">{quote.amount}</p></div></div>)}</div>:<EmptyState icon="doc" title="No quotations yet" text="Request a quotation from a RoadLenz product page and it will appear here." action={<Link href="/products" className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">Browse Products</Link>}/>}</Panel></div>}

          {tab === "saved" && <div className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Shortlist</p><h1 className="mt-1 text-2xl font-black">Saved Products</h1><p className="mt-1 text-sm text-slate-500">Products you saved for quick access.</p></div>{savedProducts.length?<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">{savedProducts.map((product)=><Panel key={product.id} className="overflow-hidden"><div className="aspect-[4/3] bg-slate-50 p-5"><SmartImage src={product.image} alt={product.name} className="h-full w-full object-contain"/></div><div className="p-5"><p className="text-[10px] font-black uppercase tracking-wider text-blue-700">{product.category}</p><h3 className="mt-1 font-extrabold text-slate-900">{product.name}</h3><p className="mt-2 text-sm font-black">{product.price}</p><div className="mt-4 flex gap-2"><Link href={`/products/${product.slug}`} className="flex-1 rounded-xl bg-blue-600 px-3 py-2.5 text-center text-xs font-bold text-white">View Product</Link><button onClick={()=>toggleSave(product.slug)} className="rounded-xl border border-slate-200 px-3 text-red-600"><Icon name="heart" className="h-4 w-4"/></button></div></div></Panel>)}</div>:<Panel><EmptyState icon="heart" title="No saved products" text="Save products from the catalogue to compare or revisit them later." action={<Link href="/products" className="inline-flex rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white">Browse Products</Link>}/></Panel>}</div>}

          {tab === "documents" && <div className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Records</p><h1 className="mt-1 text-2xl font-black">Invoices & Documents</h1><p className="mt-1 text-sm text-slate-500">Actual account invoices and product documents available to you.</p></div><div className="grid gap-6 xl:grid-cols-2"><Panel><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-black">Invoices</h2></div>{data.invoices.length?<div className="divide-y divide-slate-100">{data.invoices.map((invoice)=><div key={invoice.id} className="flex items-center justify-between gap-3 px-5 py-4"><div><p className="font-bold">{invoice.invoiceNumber}</p><p className="mt-1 text-xs text-slate-500">{formatDate(invoice.createdAt)} · {money(invoice.amount)}</p></div><div className="flex items-center gap-3"><Status value={invoice.paymentStatus}/>{invoice.pdfUrl?<a href={invoice.pdfUrl} target="_blank" rel="noreferrer" className="rounded-lg border border-blue-200 px-3 py-2 text-xs font-bold text-blue-700">Download</a>:null}</div></div>)}</div>:<EmptyState icon="doc" title="No invoices available" text="Invoices will appear here when they are generated for your orders."/>}</Panel><Panel><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-black">Product Documents</h2></div>{registeredDocs.length?<div className="divide-y divide-slate-100">{registeredDocs.map((doc,index)=><div key={`${doc.url}-${index}`} className="flex items-center justify-between gap-3 px-5 py-4"><div className="min-w-0"><p className="truncate font-bold">{doc.name}</p><p className="mt-1 truncate text-xs text-slate-500">{doc.product} · {doc.serial}</p></div><a href={doc.url} target="_blank" rel="noreferrer" className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-blue-700">Open</a></div>)}</div>:<EmptyState icon="download" title="No product documents" text="Documents associated with your registered RoadLenz products will appear here."/>}</Panel></div></div>}

          {tab === "profile" && <div className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Account</p><h1 className="mt-1 text-2xl font-black">Profile & Addresses</h1></div><div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><Panel className="p-5"><h2 className="font-black">Profile</h2><div className="mt-5 space-y-4">{[["Name","name"],["Company","company"],["Phone","phone"]].map(([label,key])=><label key={key} className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span><input value={profileDraft[key as keyof typeof profileDraft]} onChange={(e)=>setProfileDraft({...profileDraft,[key]:e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm"/></label>)}<label className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">Email</span><input value={profile.email} readOnly className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-500"/><span className="mt-1 block text-[11px] text-slate-400">Email changes require account support.</span></label><button disabled={profileBusy} onClick={saveProfile} className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{profileBusy?"Saving…":"Save profile"}</button></div></Panel><Panel className="p-5"><div className="flex items-center justify-between"><div><h2 className="font-black">Saved Addresses</h2><p className="mt-1 text-xs text-slate-500">Used for delivery and order coordination.</p></div><button onClick={()=>setAddressDrafts([...addressDrafts,{id:`new_${Date.now()}`,label:"Address",fullName:profile.name,phone:profile.phone,line1:"",city:"",state:"Tamil Nadu",postalCode:"",country:"India",isDefault:addressDrafts.length===0}])} className="text-xs font-bold text-blue-700">+ Add address</button></div><div className="mt-4 space-y-4">{addressDrafts.length?addressDrafts.map((address,index)=><div key={address.id} className="rounded-xl border border-slate-200 p-4"><div className="mb-3 flex items-center justify-between"><input value={address.label} onChange={(e)=>setAddressDrafts(addressDrafts.map((row,i)=>i===index?{...row,label:e.target.value}:row))} className="w-40 border-0 bg-transparent p-0 text-sm font-black outline-none"/><button onClick={()=>setAddressDrafts(addressDrafts.filter((_,i)=>i!==index))} className="text-xs font-bold text-red-600">Remove</button></div><div className="grid gap-2 sm:grid-cols-2">{([['fullName','Full name'],['phone','Phone'],['line1','Address line 1'],['line2','Address line 2'],['city','City'],['state','State'],['postalCode','PIN code'],['country','Country']] as const).map(([key,label])=><input key={key} value={address[key] ?? ""} onChange={(e)=>setAddressDrafts(addressDrafts.map((row,i)=>i===index?{...row,[key]:e.target.value}:row))} placeholder={label} className="rounded-lg border border-slate-200 px-3 py-2 text-xs"/>)}</div><label className="mt-3 flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={Boolean(address.isDefault)} onChange={()=>setAddressDrafts(addressDrafts.map((row,i)=>({...row,isDefault:i===index})))} />Default address</label></div>):<p className="rounded-xl bg-slate-50 p-5 text-sm text-slate-500">No addresses saved yet.</p>}<button disabled={profileBusy} onClick={saveProfile} className="w-full rounded-xl border border-blue-200 px-4 py-2.5 text-sm font-bold text-blue-700 disabled:opacity-50">Save addresses</button></div></Panel></div></div>}

          {tab === "support" && <div className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Help centre</p><h1 className="mt-1 text-2xl font-black">Support</h1><p className="mt-1 text-sm text-slate-500">Customer, installation and technical support in one place.</p></div><div className="grid gap-4 md:grid-cols-3">{[["headset","Customer Support","Account, order and quotation assistance"],["wrench","Installation Support","Scheduling, fitment and commissioning"],["chip","Technical Support","Hardware, software and device issues"]].map(([icon,title,text])=><Panel key={title} className="p-5"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-700"><Icon name={icon}/></span><h3 className="mt-4 font-black">{title}</h3><p className="mt-1 text-xs leading-5 text-slate-500">{text}</p></Panel>)}</div><div className="grid gap-6 xl:grid-cols-[.8fr_1.2fr]"><Panel className="p-5"><h2 className="font-black">Create support ticket</h2><form onSubmit={createTicket} className="mt-4 space-y-3"><input value={ticketForm.subject} onChange={(e)=>setTicketForm({...ticketForm,subject:e.target.value})} placeholder="Subject" className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" required/><textarea value={ticketForm.description} onChange={(e)=>setTicketForm({...ticketForm,description:e.target.value})} placeholder="Describe what you need help with" rows={6} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" required/><button disabled={ticketBusy} className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{ticketBusy?"Creating…":"Create ticket"}</button></form></Panel><Panel><div className="border-b border-slate-100 px-5 py-4"><h2 className="font-black">Your tickets</h2></div>{profile.tickets.length?<div className="divide-y divide-slate-100">{[...profile.tickets].sort((a,b)=>b.updatedAt.localeCompare(a.updatedAt)).map((ticket)=><div key={ticket.id} className="px-5 py-4"><div className="flex items-start justify-between gap-3"><div><p className="font-bold">{ticket.ref} · {ticket.subject}</p><p className="mt-1 text-xs leading-5 text-slate-500">{ticket.description}</p></div><Status value={ticket.status}/></div>{ticket.replies.length?<div className="mt-3 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600"><span className="font-bold">Latest response:</span> {ticket.replies[ticket.replies.length-1].text}</div>:null}</div>)}</div>:<EmptyState icon="headset" title="No support tickets" text="Create a ticket when you need assistance from the RoadLenz team."/>}</Panel></div></div>}

          {tab === "security" && <div className="space-y-5"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Account protection</p><h1 className="mt-1 text-2xl font-black">Security</h1></div><Panel className="max-w-xl p-6"><h2 className="font-black">Change password</h2><p className="mt-1 text-sm text-slate-500">Use at least 8 characters for your new password.</p><form onSubmit={changePassword} className="mt-5 space-y-4">{[["Current password","currentPassword"],["New password","newPassword"],["Confirm new password","confirmPassword"]].map(([label,key])=><label key={key} className="block"><span className="mb-1.5 block text-xs font-bold text-slate-600">{label}</span><input type="password" autoComplete={key==="currentPassword"?"current-password":"new-password"} value={passwordForm[key as keyof typeof passwordForm]} onChange={(e)=>setPasswordForm({...passwordForm,[key]:e.target.value})} className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm" required/></label>)}<button disabled={passwordBusy} className="w-full rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-bold text-white disabled:opacity-50">{passwordBusy?"Updating…":"Update password"}</button></form></Panel></div>}

          {tab === "notifications" && <div className="space-y-5"><div className="flex items-end justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-[.16em] text-slate-400">Updates</p><h1 className="mt-1 text-2xl font-black">Notifications</h1></div>{unread>0?<button onClick={markRead} className="text-xs font-bold text-blue-700">Mark all as read</button>:null}</div><Panel>{profile.notifications.length?<div className="divide-y divide-slate-100">{profile.notifications.map((notification)=><div key={notification.id} className={`flex gap-3 px-5 py-4 ${notification.read?"":"bg-blue-50/40"}`}><span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${notification.read?"bg-slate-200":"bg-blue-600"}`}/><div><p className="text-sm font-semibold text-slate-800">{notification.text}</p><p className="mt-1 text-xs text-slate-400">{formatDate(notification.createdAt)}</p></div></div>)}</div>:<EmptyState icon="bell" title="No notifications" text="Order, quotation and support updates will appear here."/>}</Panel></div>}
        </motion.div></AnimatePresence>
      </main>
    </div>
  </div>;
}
