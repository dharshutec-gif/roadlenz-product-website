"use client";
import { useEffect, useRef } from "react";

export default function useConsoleNotifications(refresh: () => void) {
  const callback = useRef(refresh);
  useEffect(() => { callback.current = refresh; }, [refresh]);
  useEffect(() => {
    let stream: EventSource | null = null;
    const connect = () => {
      stream?.close();
      stream = null;
      if (document.visibilityState !== "visible") return;
      stream = new EventSource("/api/notifications/stream");
      stream.addEventListener("refresh", () => callback.current());
    };
    connect();
    document.addEventListener("visibilitychange", connect);
    return () => { stream?.close(); document.removeEventListener("visibilitychange", connect); };
  }, []);
}
