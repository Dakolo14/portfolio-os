import { useState, useRef, useCallback } from "react";
import Draggable from "react-draggable";
import { getFolderIcon } from "../lib/getFolderIcon";
import { useWindows } from "../state/windowManager";
import { playClick } from "../lib/sounds";

// ============================================================
// DesktopIcon — Draggable folder icon with localStorage position
// ============================================================

const DRAG_THRESHOLD = 5;
const POSITIONS_KEY = "koladeOS_iconPositions";

function loadPositions() {
  try {
    const saved = localStorage.getItem(POSITIONS_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return {};
}

function savePositions(positions) {
  try {
    localStorage.setItem(POSITIONS_KEY, JSON.stringify(positions));
  } catch { /* ignore */ }
}

export default function DesktopIcon({ folder, selected, onSelect, isMobile }) {
  const { openWindow } = useWindows();
  const [dragged, setDragged] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });
  const nodeRef = useRef(null);

  // Load saved position for this icon
  const savedPositions = loadPositions();
  const [position, setPosition] = useState(
    savedPositions[folder.id] || { x: 0, y: 0 }
  );

  const handleDragStart = useCallback((_e, data) => {
    startPos.current = { x: data.x, y: data.y };
    setDragged(false);
  }, []);

  const handleDrag = useCallback((_e, data) => {
    const dx = Math.abs(data.x - startPos.current.x);
    const dy = Math.abs(data.y - startPos.current.y);
    if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
      setDragged(true);
    }
  }, []);

  const handleDragStop = useCallback(
    (_e, data) => {
      const newPos = { x: data.x, y: data.y };
      setPosition(newPos);
      // Save all positions to localStorage
      const all = loadPositions();
      all[folder.id] = newPos;
      savePositions(all);
    },
    [folder.id]
  );

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (dragged) return;
      playClick();
      onSelect(folder.id);

      // On mobile, single tap opens the folder
      if (isMobile) {
        openWindow({
          id: `folder-${folder.id}`,
          kind: "folder",
          folderId: folder.id,
          title: folder.name,
          w: 550,
          h: 400,
        });
      }
    },
    [dragged, folder, onSelect, openWindow, isMobile]
  );

  const handleDoubleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (dragged || isMobile) return;
      openWindow({
        id: `folder-${folder.id}`,
        kind: "folder",
        folderId: folder.id,
        title: folder.name,
        w: 550,
        h: 400,
      });
    },
    [dragged, folder, openWindow, isMobile]
  );

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      onSelect(folder.id);
      openWindow({
        id: `folder-${folder.id}`,
        kind: "folder",
        folderId: folder.id,
        title: folder.name,
        w: 550,
        h: 400,
      });
    },
    [folder, onSelect, openWindow]
  );

  const icon = getFolderIcon(folder.files.length);

  // On mobile, don't use Draggable
  if (isMobile) {
    return (
      <div
        className={`desktop-icon ${selected ? "desktop-icon--selected" : ""}`}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label={`Open ${folder.name} folder`}
        onKeyDown={handleKeyDown}
      >
        <img
          src={icon}
          alt=""
          className="desktop-icon__img"
          draggable={false}
        />
        <span className="desktop-icon__label">{folder.name}</span>
      </div>
    );
  }

  return (
    <Draggable
      nodeRef={nodeRef}
      position={position}
      onStart={handleDragStart}
      onDrag={handleDrag}
      onStop={handleDragStop}
      bounds="parent"
    >
      <div
        ref={nodeRef}
        className={`desktop-icon ${selected ? "desktop-icon--selected" : ""}`}
        onClick={handleClick}
        onDoubleClick={handleDoubleClick}
        role="button"
        tabIndex={0}
        aria-label={`Open ${folder.name} folder`}
        onKeyDown={handleKeyDown}
      >
        <img
          src={icon}
          alt=""
          className="desktop-icon__img"
          draggable={false}
        />
        <span className="desktop-icon__label">{folder.name}</span>
      </div>
    </Draggable>
  );
}
