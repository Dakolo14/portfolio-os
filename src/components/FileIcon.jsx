import { useState, useRef, useCallback } from "react";

// ============================================================
// FileIcon — Draggable document icon inside a folder window
// ============================================================

const DRAG_THRESHOLD = 5;

// Inline SVG document icon
const DocumentIcon = () => (
  <svg
    width="40"
    height="48"
    viewBox="0 0 40 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className="file-icon__svg"
  >
    <path
      d="M4 4C4 1.79086 5.79086 0 8 0H26L36 10V44C36 46.2091 34.2091 48 32 48H8C5.79086 48 4 46.2091 4 44V4Z"
      fill="#3a3a4a"
    />
    <path d="M26 0L36 10H30C27.7909 10 26 8.20914 26 6V0Z" fill="#52526a" />
    <rect x="10" y="16" width="20" height="2" rx="1" fill="#6a6a80" />
    <rect x="10" y="22" width="16" height="2" rx="1" fill="#6a6a80" />
    <rect x="10" y="28" width="18" height="2" rx="1" fill="#6a6a80" />
    <rect x="10" y="34" width="12" height="2" rx="1" fill="#6a6a80" />
  </svg>
);

export default function FileIcon({ file, onOpen, isMobile }) {
  const [dragged, setDragged] = useState(false);
  const startPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    startPos.current = { x: e.clientX, y: e.clientY };
    setDragged(false);
  }, []);

  const handleMouseUp = useCallback((e) => {
    const dx = Math.abs(e.clientX - startPos.current.x);
    const dy = Math.abs(e.clientY - startPos.current.y);
    if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
      setDragged(true);
    }
  }, []);

  const handleClick = useCallback(
    (e) => {
      e.stopPropagation();
      // On mobile, single tap opens
      if (isMobile && !dragged) {
        onOpen(file);
      }
    },
    [file, onOpen, dragged, isMobile]
  );

  const handleDoubleClick = useCallback(
    (e) => {
      e.stopPropagation();
      if (!dragged && !isMobile) {
        onOpen(file);
      }
    },
    [file, onOpen, dragged, isMobile]
  );

  return (
    <div
      className="file-icon"
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
    >
      <DocumentIcon />
      <span className="file-icon__label">{file.name}</span>
    </div>
  );
}
