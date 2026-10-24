"use client";

import { useEffect, useRef, useState } from "react";

const SPEED = 0.5; // pixels per frame, roughly 30px per second

export default function AutoScrollBox({ children }) {
  const boxRef = useRef(null);
  const hoverRef = useRef(false);
  const posRef = useRef(0);
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setEnabled(false);
    }
  }, []);

  useEffect(() => {
    const el = boxRef.current;
    if (!el || !enabled) return;

    posRef.current = el.scrollTop;
    let frame;
    let waitUntil = 0;

    function tick(now) {
      if (!hoverRef.current && now >= waitUntil) {
        const max = el.scrollHeight - el.clientHeight;
        if (max > 0) {
          posRef.current += SPEED;
          if (posRef.current >= max) {
            // Rest at the bottom for a moment, then jump back to the top.
            posRef.current = 0;
            el.scrollTop = max;
            waitUntil = now + 2000;
            setTimeout(() => {
              el.scrollTop = 0;
            }, 2000);
          } else {
            el.scrollTop = posRef.current;
          }
        }
      }
      frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [enabled]);

  function pause() {
    hoverRef.current = true;
  }

  function resume() {
    const el = boxRef.current;
    if (el) posRef.current = el.scrollTop;
    hoverRef.current = false;
  }

  return (
    <div>
      <div className="mb-2 flex justify-end">
        <button
          onClick={() => setEnabled((v) => !v)}
          className="border border-hairline px-3 py-1 font-data text-[11px] text-mauve transition-colors hover:text-warm-white"
        >
          Auto-scroll: {enabled ? "On" : "Off"}
        </button>
      </div>
      <div
        ref={boxRef}
        onMouseEnter={pause}
        onMouseLeave={resume}
        onTouchStart={pause}
        onTouchEnd={resume}
        className="max-h-[560px] overflow-y-auto border-t border-hairline"
      >
        {children}
      </div>
    </div>
  );
}
