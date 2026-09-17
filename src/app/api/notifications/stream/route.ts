import { NextRequest } from "next/server";
import { requireAuth } from "@/lib/api";
import { sessionFromRequest } from "@/lib/auth";
import { readDb } from "@/lib/db";
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const auth = requireAuth(req);
  if (!auth.ok) return auth.res;
  let stop = () => {};
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let previous = "", closed = false, ticks = 0;
      const send = (text: string) => { if (!closed) controller.enqueue(encoder.encode(text)); };
      const timer = setInterval(() => {
        try {
          const session = sessionFromRequest(req);
          if (!session || session.userId !== auth.session.userId) { stop(); return; }
          const db = readDb();
          const revision = session.role === "admin" ? db.updatedAt : JSON.stringify({
            notifications: db.customers[session.userId]?.notifications ?? [],
            orders: db.orders.filter(order => order.customerUserId === session.userId).map(order => [order.id, order.updatedAt, order.status]),
            quotes: db.customers[session.userId]?.quotes ?? [],
          });
          if (revision !== previous) { previous = revision; send('event: refresh\ndata: {}\n\n'); }
          if (++ticks % 15 === 0) send(': heartbeat\n\n');
        } catch { stop(); }
      }, 1000);
      stop = () => {
        if (closed) return;
        closed = true;
        clearInterval(timer);
        req.signal.removeEventListener("abort", stop);
        try { controller.close(); } catch { /* Reader may already have cancelled. */ }
      };
      req.signal.addEventListener("abort", stop, { once: true });
      if (req.signal.aborted) stop();
      else send('retry: 3000\n\n');
    },
    cancel() { stop(); },
  });
  return new Response(stream, { headers: { "Content-Type": "text/event-stream", "Cache-Control": "no-cache, no-transform, private", "X-Accel-Buffering": "no", Connection: "keep-alive" } });
}
