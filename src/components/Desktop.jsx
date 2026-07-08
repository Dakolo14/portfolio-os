import { useState, useCallback, useEffect } from "react";
import { desktop } from "../data/fileSystem";
import DesktopIcon from "./DesktopIcon";
import ContextMenu from "./ContextMenu";
import wallpaper from "../assets/wallpaper.png";

// ============================================================
// Desktop — Wallpaper + icon grid (windows moved to App level)
// ============================================================

export default function Desktop() {
  const [selectedIcon, setSelectedIcon] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  // Detect mobile
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Click on empty desktop deselects
  const handleDesktopClick = useCallback((e) => {
    // Only deselect if clicking directly on the desktop itself
    if (e.target === e.currentTarget || e.target.closest('.desktop__icons')) {
      setSelectedIcon(null);
    }
    setContextMenu(null);
  }, []);

  // Right-click context menu
  const handleContextMenu = useCallback((e) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY });
  }, []);

  return (
    <div
      className="desktop"
      style={{ backgroundImage: `url(${wallpaper})` }}
      onClick={handleDesktopClick}
      onContextMenu={handleContextMenu}
    >
      {/* Desktop icon grid */}
      <div className="desktop__icons">
        {desktop.map((folder) => (
          <DesktopIcon
            key={folder.id}
            folder={folder}
            selected={selectedIcon === folder.id}
            onSelect={setSelectedIcon}
            isMobile={isMobile}
          />
        ))}
      </div>

      {/* Context menu */}
      {contextMenu && (
        <ContextMenu
          position={contextMenu}
          onClose={() => setContextMenu(null)}
        />
      )}
    </div>
  );
}
