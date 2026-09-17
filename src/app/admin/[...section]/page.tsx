import { redirect } from "next/navigation";
import AdminConsole from "@/components/admin/AdminConsole";
import { getCurrentSession } from "@/lib/auth";
export const dynamic = "force-dynamic";
export const metadata = { title: "Administration Console | RoadLenz", robots: { index: false, follow: false } };
export default async function AdminSectionPage({ params }: { params: Promise<{ section: string[] }> }) {
  const session = await getCurrentSession();
  if (!session) redirect("/admin/login");
  if (session.role !== "admin") redirect("/dashboard");
  const { section } = await params;
  return <AdminConsole section={section} session={{ name: session.name, email: session.email, adminRole: session.adminRole }}/>;
}
