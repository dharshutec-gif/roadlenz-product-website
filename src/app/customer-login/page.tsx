import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getCurrentSession } from "@/lib/auth";
import CustomerPortalAuth from "@/components/customer/CustomerPortalAuth";

export const metadata: Metadata = {
  title: "Customer Portal | RoadLenz",
  description:
    "Sign in or create your RoadLenz customer account to manage fleet products, orders, quotations and support.",
};

export default async function CustomerLoginPage() {
  const session = await getCurrentSession();

  if (session?.role === "customer") {
    redirect("/dashboard");
  }

  if (session?.role === "admin") {
    redirect("/admin");
  }

  return <CustomerPortalAuth />;
}