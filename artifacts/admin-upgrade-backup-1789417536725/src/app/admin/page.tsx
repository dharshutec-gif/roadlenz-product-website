import type { Metadata } from "next";
import { redirect } from "next/navigation";
import AdminConsole from "@/components/admin/AdminConsole";
import { getCurrentSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin Console | RoadLenz",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  const session = await getCurrentSession();
  if (!session) redirect("/admin/login");
  if (session.role === "customer") redirect("/dashboard");

  return <AdminConsole session={{ name: session.name, email: session.email }} />;
}
