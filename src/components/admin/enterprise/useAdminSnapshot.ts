"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import type { AdminSnapshot } from "@/lib/admin-types";
import useConsoleNotifications from "@/components/useConsoleNotifications";
export async function adminOperation(body: Record<string, unknown>) {
  const response = await fetch("/api/admin/operations", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
  const result: Record<string, unknown> = await response.json();
  if (!response.ok) throw new Error(typeof result.error === "string" ? result.error : "The change could not be saved.");
  window.dispatchEvent(new Event("roadlenz:admin-refresh"));
  return result;
}
export default function useAdminSnapshot() {
  const [snapshot, setSnapshot] = useState<AdminSnapshot | null>(null);
  const [error, setError] = useState("");
  const [checkedAt, setCheckedAt] = useState<Date | null>(null);
  const active = useRef(false);
  const refresh = useCallback(async () => {
    if (active.current) return;
    active.current = true;
    try {
      const response = await fetch("/api/admin/console", { cache: "no-store" });
      if (response.status === 401) { window.location.assign("/admin/login"); return; }
      const body = await response.json();
      if (!response.ok) throw new Error(body.error || "Unable to refresh operations.");
      setSnapshot(body as AdminSnapshot); setError(""); setCheckedAt(new Date());
    } catch (reason) { setError(reason instanceof Error ? reason.message : "Connection failed."); }
    finally { active.current = false; }
  }, []);
  useConsoleNotifications(() => { void refresh(); });
  useEffect(() => {
    let sending = false;
    const retryEmail = async () => {
      if (sending || document.visibilityState !== "visible") return;
      sending = true;
      try { await fetch("/api/admin/enquiries/retry-email", { method: "POST" }); }
      catch { /* Pending email remains recorded for the next retry. */ }
      finally { sending = false; }
    };
    void retryEmail();
    const timer = window.setInterval(() => { void retryEmail(); }, 60000);
    return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    void refresh();
    const visible = () => { if (document.visibilityState === "visible") void refresh(); };
    const timer = window.setInterval(visible, 5000);
    window.addEventListener("focus", visible); document.addEventListener("visibilitychange", visible); window.addEventListener("roadlenz:admin-refresh", visible);
    return () => { clearInterval(timer); window.removeEventListener("focus", visible); document.removeEventListener("visibilitychange", visible); window.removeEventListener("roadlenz:admin-refresh", visible); };
  }, [refresh]);
  return { snapshot, error, checkedAt, refresh };
}
