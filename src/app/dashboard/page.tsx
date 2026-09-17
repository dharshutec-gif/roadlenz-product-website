import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getCurrentSession } from "@/lib/auth";
import CustomerWorkspace from "@/components/customer/CustomerWorkspace";

export const metadata: Metadata = {
  title: "Customer Dashboard",
  robots: { index: false },
};

export default async function DashboardPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/customer-login");
  if (session.role === "admin") redirect("/admin");

  return <CustomerWorkspace initialName={session.name} />;
}
