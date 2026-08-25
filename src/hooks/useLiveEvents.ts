import { useEffect, useState } from "react";

export interface LiveEvent {
  type: "payment" | "checkin" | "marketing_action";
  payload: any;
  timestamp: number;
}

export function useLiveEvents() {
  const [events, setEvents] = useState<LiveEvent[]>([]);

  useEffect(() => {
    // Connect to SSE stream
    const eventSource = new EventSource("/api/v1/live-stream");

    eventSource.onmessage = (e) => {
      try {
        const ev = JSON.parse(e.data) as LiveEvent;
        setEvents((prev) => {
          // Prevent duplicates
          if (prev.some((p) => p.timestamp === ev.timestamp && p.type === ev.type)) {
            return prev;
          }
          return [ev, ...prev].slice(0, 50); // Keep last 50 events
        });
      } catch (err) {
        console.warn("Failed to parse live event:", err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn("SSE connection error, closing stream:", err);
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);

  return events;
}
