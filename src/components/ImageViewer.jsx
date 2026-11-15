import { useState, useEffect, useRef, useCallback } from "react";
import { getFileType } from "../lib/media";

// ============================================================
// ImageViewer — Eye-of-GNOME-style viewer that pages through
// every image in the same folder (arrow keys, swipe, buttons)
// ============================================================

const SWIPE_MIN = 40;

export default function ImageViewer({ folder, fileId, onChange }) {
  const images = folder.files.filter((f) => getFileType(f) === "image");
  const startIndex = Math.max(0, images.findIndex((f) => f.id === fileId));
  const [index, setIndex] = useState(startIndex);
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const rootRef = useRef(null);
  const touchX = useRef(null);

  const count = images.length;
  const current = images[index];

  const go = useCallback(
    (delta) => {
      if (count < 2) return;
      setLoaded(false);
      setFailed(false);
      setIndex((i) => (i + delta + count) % count);
    },
    [count]
  );

  // Keep the window title in sync with the image on screen
  useEffect(() => {
    if (current && current.id !== fileId) onChange?.(current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current?.id]);

  // Focus so arrow keys work straight away
  useEffect(() => {
    rootRef.current?.focus({ preventScroll: true });
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(1);
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(-1);
    }
  };

  const onTouchStart = (e) => {
    touchX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchX.current == null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > SWIPE_MIN) go(dx < 0 ? 1 : -1);
  };

  if (!current) {
    return <div className="media-viewer media-viewer--empty">Image not found.</div>;
  }

  return (
    <div
      ref={rootRef}
      className="media-viewer"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
      aria-label={`Image viewer: ${current.name}`}
    >
      <div className="media-viewer__stage">
        {!loaded && !failed && <div className="media-viewer__spinner" aria-hidden="true" />}
        {failed ? (
          <p className="media-viewer__error">Couldn't load {current.name}</p>
        ) : (
          <img
            key={current.id}
            src={current.src}
            alt={current.alt || current.caption || current.name}
            className={`media-viewer__img ${loaded ? "is-loaded" : ""}`}
            onLoad={() => setLoaded(true)}
            onError={() => setFailed(true)}
            draggable={false}
          />
        )}

        {count > 1 && (
          <>
            <button
              className="media-viewer__nav media-viewer__nav--prev"
              onClick={() => go(-1)}
              aria-label="Previous image"
            >
              ‹
            </button>
            <button
              className="media-viewer__nav media-viewer__nav--next"
              onClick={() => go(1)}
              aria-label="Next image"
            >
              ›
            </button>
          </>
        )}
      </div>

      <div className="media-viewer__bar">
        <span className="media-viewer__name" title={current.name}>
          {current.caption || current.name}
        </span>
        {count > 1 && (
          <span className="media-viewer__count">
            {index + 1} / {count}
          </span>
        )}
      </div>
    </div>
  );
}
