import { useState, useRef, useCallback } from "react";
import { getFileType, getYouTubeId, youTubeThumbUrl } from "../lib/media";

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

// Thumbnail for image and video files (Nautilus-style)
function MediaThumb({ file, type }) {
  const [failed, setFailed] = useState(false);
  const ytId = type === "video" ? getYouTubeId(file.youtube || file.src) : null;
  const thumb = file.thumbnail || (ytId ? youTubeThumbUrl(ytId) : type === "image" ? file.src : file.poster);

  return (
    <div className={`file-icon__thumb file-icon__thumb--${type}`}>
      {thumb && !failed ? (
        <img
          src={thumb}
          alt=""
          loading="lazy"
          draggable={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <span className="file-icon__thumb-fallback" aria-hidden="true">
          {type === "video" ? "🎬" : "🖼"}
        </span>
      )}
      {type === "video" && (
        <span className="file-icon__play" aria-hidden="true">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor"><path d="M8 5v14l11-7z" /></svg>
        </span>
      )}
    </div>
  );
}

export default function FileIcon({ file, onOpen, isMobile }) {
  const type = getFileType(file);
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
      role="button"
      tabIndex={0}
      aria-label={`Open ${file.name}`}
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onOpen(file);
        }
      }}
    >
      {type === "text" ? <DocumentIcon /> : <MediaThumb file={file} type={type} />}
      <span className="file-icon__label">{file.name}</span>
    </div>
  );
}
