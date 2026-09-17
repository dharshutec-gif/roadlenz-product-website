import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getCurrentSession } from "../../lib/auth";
import LoginForm from "../../components/LoginForm";
import { Logo } from "../../components/ui";

export const metadata: Metadata = {
  title: "Admin Login",
  robots: { index: false },
};

export default async function AdminLoginPage() {
  const session = await getCurrentSession();
  if (session?.role === "admin") redirect("/admin");
  if (session?.role === "customer") redirect("/dashboard");

  return (
    <section className="relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-ink pt-[72px]">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(900px 500px at 70% 10%, rgba(18,89,214,0.3), transparent 60%)" }}
      />
      <div className="shell relative flex flex-col items-center py-16">
        <Link href="/" className="mb-8">
          <Logo dark />
        </Link>
        <LoginForm
          intent="admin"
          title="Admin console"
          sub="Content, products, locations, requests and site settings — restricted to RoadLenz administrators."
          demoEmail="admin@roadlenz.in"
          demoPassword="Admin@123"
          successHref="/admin"
        />
        <p className="mt-6 text-xs text-white/40">Restricted area. All access is logged.</p>
      </div>
    </section>
  );
}
