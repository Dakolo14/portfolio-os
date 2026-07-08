import { useState, useEffect, useRef } from "react";
import { useWindows } from "../state/windowManager";
import { useTheme } from "../state/themeManager";

// ============================================================
// ContextMenu — Right-click context menu with appearance settings
// ============================================================

export default function ContextMenu({ position, onClose }) {
  const { openWindow } = useWindows();
  const { themeId, themes, iconSize, iconSizes, setTheme, setIconSize } = useTheme();
  const [submenu, setSubmenu] = useState(null); // "appearance" | "theme" | "iconsize" | null
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        if (submenu) setSubmenu(null);
        else onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose, submenu]);

  if (!position) return null;

  // Ensure menu stays on screen
  const menuStyle = {
    left: Math.min(position.x, window.innerWidth - 220),
    top: Math.min(position.y, window.innerHeight - 300),
  };

  if (submenu === "theme") {
    return (
      <div ref={menuRef} className="context-menu" style={menuStyle} onClick={(e) => e.stopPropagation()}>
        <div className="context-menu__header">
          <button className="context-menu__back" onClick={() => setSubmenu("appearance")}>← Theme</button>
        </div>
        {Object.values(themes).map((t) => (
          <button
            key={t.id}
            className={`context-menu__item ${themeId === t.id ? "context-menu__item--active" : ""}`}
            onClick={() => { setTheme(t.id); }}
          >
            <span className="context-menu__color-dot" style={{ background: t.accent }} />
            <span>{t.label}</span>
            {themeId === t.id && <span className="context-menu__check">✓</span>}
          </button>
        ))}
        <button
          className={`context-menu__item ${themeId === "system" ? "context-menu__item--active" : ""}`}
          onClick={() => { setTheme("system"); }}
        >
          <span className="context-menu__color-dot" style={{ background: "linear-gradient(135deg, #333 50%, #eee 50%)" }} />
          <span>System</span>
          {themeId === "system" && <span className="context-menu__check">✓</span>}
        </button>
      </div>
    );
  }

  if (submenu === "iconsize") {
    return (
      <div ref={menuRef} className="context-menu" style={menuStyle} onClick={(e) => e.stopPropagation()}>
        <div className="context-menu__header">
          <button className="context-menu__back" onClick={() => setSubmenu("appearance")}>← Icon Size</button>
        </div>
        {Object.entries(iconSizes).map(([key, val]) => (
          <button
            key={key}
            className={`context-menu__item ${iconSize === key ? "context-menu__item--active" : ""}`}
            onClick={() => { setIconSize(key); }}
          >
            <span>{val.label}</span>
            {iconSize === key && <span className="context-menu__check">✓</span>}
          </button>
        ))}
      </div>
    );
  }

  if (submenu === "appearance") {
    return (
      <div ref={menuRef} className="context-menu" style={menuStyle} onClick={(e) => e.stopPropagation()}>
        <div className="context-menu__header">
          <button className="context-menu__back" onClick={() => setSubmenu(null)}>← Appearance</button>
        </div>
        <button className="context-menu__item" onClick={() => setSubmenu("theme")}>
          <span className="context-menu__icon">🎨</span>
          <span>Theme</span>
          <span className="context-menu__chevron">›</span>
        </button>
        <button className="context-menu__item" onClick={() => setSubmenu("iconsize")}>
          <span className="context-menu__icon">📐</span>
          <span>Icon Size</span>
          <span className="context-menu__chevron">›</span>
        </button>
      </div>
    );
  }

  // Main menu
  return (
    <div ref={menuRef} className="context-menu" style={menuStyle} onClick={(e) => e.stopPropagation()}>
      <button
        className="context-menu__item"
        onClick={() => {
          openWindow({
            id: "terminal",
            kind: "terminal",
            title: "Terminal",
            w: 600,
            h: 400,
          });
          onClose();
        }}
      >
        <span className="context-menu__icon">&gt;_</span>
        <span>Open Terminal</span>
      </button>
      <div className="context-menu__separator" />
      <button
        className="context-menu__item"
        onClick={() => setSubmenu("appearance")}
      >
        <span className="context-menu__icon">🎨</span>
        <span>Change Appearance</span>
        <span className="context-menu__chevron">›</span>
      </button>
      <div className="context-menu__separator" />
      <button
        className="context-menu__item"
        onClick={() => {
          onClose();
          window.location.reload();
        }}
      >
        <span className="context-menu__icon">🔄</span>
        <span>Refresh</span>
      </button>
      <div className="context-menu__separator" />
      <button
        className="context-menu__item"
        onClick={() => {
          openWindow({
            id: "file-resume",
            kind: "file",
            folderId: "contact",
            fileId: "resume",
            title: "About KoladeOS",
            w: 500,
            h: 400,
          });
          onClose();
        }}
      >
        <span className="context-menu__icon">ℹ</span>
        <span>About KoladeOS</span>
      </button>
    </div>
  );
}
