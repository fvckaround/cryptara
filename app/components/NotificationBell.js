"use client";

import { useEffect, useRef, useState } from "react";

function timeAgo(date) {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "just now";
}

export default function NotificationBell() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const wrapperRef = useRef(null);

  async function load() {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      if (res.ok) {
        setNotifications(data.notifications);
        setUnreadCount(data.unreadCount);
      }
    } catch (err) {
      // fail silently — notifications are non-critical
    }
  }

  useEffect(() => {
    load();
    const interval = setInterval(load, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleOpen() {
    const next = !open;
    setOpen(next);
    if (next && unreadCount > 0) {
      setUnreadCount(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      await fetch("/api/notifications/read-all", { method: "PATCH" });
    }
  }

  return (
    <div className="relative" ref={wrapperRef}>
      <button
        onClick={handleOpen}
        className="relative flex h-8 w-8 items-center justify-center text-mauve transition-colors hover:text-warm-white"
        aria-label="Notifications"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="h-5 w-5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M15 17h5l-1.4-1.4A2 2 0 0118 14.2V11a6 6 0 10-12 0v3.2a2 2 0 01-.6 1.4L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
          />
        </svg>
        {unreadCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center bg-magenta font-data text-[9px] text-warm-white">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-30 mt-3 w-80 max-w-[90vw] border border-hairline bg-plum shadow-lg">
          <div className="border-b border-hairline px-4 py-3">
            <span className="font-data text-xs uppercase tracking-wide text-mauve">
              Notifications
            </span>
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-center font-body text-sm text-mauve">
                No notifications yet
              </p>
            ) : (
              notifications.map((n) => (
                <div
                  key={n._id}
                  className="border-b border-hairline px-4 py-3 last:border-b-0"
                >
                  <p className="font-body text-sm text-warm-white">
                    {n.message}
                  </p>
                  <p className="mt-1 font-body text-xs text-mauve">
                    {timeAgo(n.createdAt)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}