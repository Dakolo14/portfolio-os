import { useState, useEffect, useCallback } from "react";
import { owner } from "../data/fileSystem";
import { resumeAudio, playStartupChime } from "../lib/sounds";

// ============================================================
// BootScreen — Linux-style boot splash + lock screen
// ============================================================

const BOOT_LINES = [
  "[  OK  ] Started systemd-journald.service",
  "[  OK  ] Reached target Local File Systems",
  "[  OK  ] Started Network Manager",
  "[  OK  ] Started GNOME Display Manager",
  "[  OK  ] Loading portfolio data...",
  "[  OK  ] Initializing window manager...",
  "[  OK  ] Starting KoladeOS Desktop Environment",
  "",
  `Welcome to KoladeOS 1.0 LTS (GNU/Linux 6.2.0-portfolio x86_64)`,
  "",
];

export default function BootScreen({ onComplete }) {
  const [phase, setPhase] = useState("boot"); // "boot" | "lock" | "done"
  const [visibleLines, setVisibleLines] = useState(0);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Boot animation — show lines one by one
  useEffect(() => {
    if (phase !== "boot") return;

    if (visibleLines < BOOT_LINES.length) {
      const timer = setTimeout(
        () => setVisibleLines((v) => v + 1),
        80 + Math.random() * 120
      );
      return () => clearTimeout(timer);
    } else {
      const timer = setTimeout(() => setPhase("lock"), 500);
      return () => clearTimeout(timer);
    }
  }, [phase, visibleLines]);

  // Update clock on lock screen
  useEffect(() => {
    if (phase !== "lock") return;
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, [phase]);

  const handleUnlock = useCallback(() => {
    // Resume audio context (browsers require user gesture)
    resumeAudio();
    playStartupChime();
    setPhase("done");
    setTimeout(onComplete, 400);
  }, [onComplete]);

  // Handle keypress on lock screen
  useEffect(() => {
    if (phase !== "lock") return;
    const handleKey = (e) => {
      if (e.key === "Enter" || e.key === " ") {
        handleUnlock();
      }
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [phase, handleUnlock]);

  if (phase === "boot") {
    return (
      <div className="boot-screen boot-screen--terminal">
        <div className="boot-screen__lines">
          {BOOT_LINES.slice(0, visibleLines).map((line, i) => (
            <div key={i} className="boot-screen__line">
              {line}
            </div>
          ))}
          <span className="boot-screen__cursor">█</span>
        </div>
      </div>
    );
  }

  if (phase === "lock") {
    const timeStr = currentTime.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
    const dateStr = currentTime.toLocaleDateString([], {
      weekday: "long",
      month: "long",
      day: "numeric",
    });

    return (
      <div className="boot-screen boot-screen--lock" onClick={handleUnlock}>
        <div className="boot-screen__lock-content">
          <div className="boot-screen__time">{timeStr}</div>
          <div className="boot-screen__date">{dateStr}</div>
          <div className="boot-screen__avatar">
            <div className="boot-screen__avatar-circle">
              {owner.name.charAt(0).toUpperCase()}
            </div>
          </div>
          <div className="boot-screen__username">{owner.name}</div>
          <div className="boot-screen__hint">
            Click or press Enter to unlock
          </div>
        </div>
      </div>
    );
  }

  // phase === "done" — fade out
  return <div className="boot-screen boot-screen--fadeout" />;
}
