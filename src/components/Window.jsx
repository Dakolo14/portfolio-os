import { useRef, useEffect, useState } from "react";
import { Rnd } from "react-rnd";
import { useWindows } from "../state/windowManager";
import { desktop } from "../data/fileSystem";
import FolderWindow from "./FolderWindow";
import FileWindow from "./FileWindow";
import Terminal from "./Terminal";
import ImageViewer from "./ImageViewer";
import VideoPlayer from "./VideoPlayer";

// ============================================================
// Window — Generic window chrome with react-rnd
// ============================================================

// Reusable window control buttons with macOS-style symbols
function WindowControls({ onClose, onMinimize, onMaximize }) {
  return (
    <div className="window__controls">
      <button
        className="window__btn window__btn--close"
        onClick={onClose}
        aria-label="Close"
        title="Close"
      >
        <span className="window__btn-symbol">×</span>
      </button>
      <button
        className="window__btn window__btn--minimize"
        onClick={onMinimize}
        aria-label="Minimize"
        title="Minimize"
      >
        <span className="window__btn-symbol">−</span>
      </button>
      <button
        className="window__btn window__btn--maximize"
        onClick={onMaximize}
        aria-label="Maximize"
        title="Maximize"
      >
        <span className="window__btn-symbol">□</span>
      </button>
    </div>
  );
}

export default function Window({ win, isMobile }) {
  const {
    focusWindow,
    closeWindow,
    minimizeWindow,
    maximizeWindow,
    moveWindow,
    resizeWindow,
    updateWindow,
    focusedId,
  } = useWindows();

  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(true);
  // While dragging/resizing, embedded iframes (YouTube) would swallow the
  // mouse and make the window stick, so we disable their pointer events.
  const [isInteracting, setIsInteracting] = useState(false);
  const rndRef = useRef(null);

  const isFocused = focusedId === win.id;

  useEffect(() => {
    const timer = setTimeout(() => setIsOpening(false), 200);
    return () => clearTimeout(timer);
  }, []);

  const handleClose = (e) => {
    e.stopPropagation();
    setIsClosing(true);
    setTimeout(() => closeWindow(win.id), 150);
  };

  const handleMinimize = (e) => {
    e.stopPropagation();
    minimizeWindow(win.id);
  };

  const handleMaximize = (e) => {
    e.stopPropagation();
    maximizeWindow(win.id);
  };

  const renderContent = () => {
    if (win.kind === "folder") {
      const folder = desktop.find((f) => f.id === win.folderId);
      if (!folder) return <div className="window__error">Folder not found</div>;
      return <FolderWindow folder={folder} isMobile={isMobile} />;
    }
    if (win.kind === "file") {
      const folder = desktop.find((f) => f.id === win.folderId);
      const file = folder?.files.find((f) => f.id === win.fileId);
      return <FileWindow file={file} />;
    }
    if (win.kind === "image") {
      const folder = desktop.find((f) => f.id === win.folderId);
      if (!folder) return <div className="window__error">Folder not found</div>;
      return (
        <ImageViewer
          folder={folder}
          fileId={win.fileId}
          onChange={(f) => updateWindow(win.id, { title: f.name, fileId: f.id })}
        />
      );
    }
    if (win.kind === "video") {
      const folder = desktop.find((f) => f.id === win.folderId);
      const file = folder?.files.find((f) => f.id === win.fileId);
      return <VideoPlayer file={file} />;
    }
    if (win.kind === "terminal") {
      return <Terminal />;
    }
    return null;
  };

  if (win.minimized) return null;

  // Mobile: render fixed/centered window
  if (isMobile) {
    return (
      <div
        className={`window window--mobile ${isFocused ? "window--focused" : "window--unfocused"} ${isClosing ? "window--closing" : ""} ${isOpening ? "window--opening" : ""}`}
        style={{ zIndex: win.z }}
        onClick={() => focusWindow(win.id)}
      >
        <div className="window__titlebar">
          <WindowControls
            onClose={handleClose}
            onMinimize={handleMinimize}
            onMaximize={handleMaximize}
          />
          <span className="window__title">{win.title}</span>
          <div className="window__controls-spacer" />
        </div>
        <div className="window__content">{renderContent()}</div>
      </div>
    );
  }

  // Desktop: react-rnd window.
  // Positions are relative to .window-layer, which already starts below the
  // top panel, so a maximized window sits at y=0 and stops just above the dock.
  const PANEL_HEIGHT = 28;
  const dockTop =
    document.querySelector(".dock")?.getBoundingClientRect().top ??
    window.innerHeight;
  const position = win.maximized ? { x: 0, y: 0 } : { x: win.x, y: win.y };
  const size = win.maximized
    ? { width: window.innerWidth, height: Math.max(240, dockTop - PANEL_HEIGHT - 8) }
    : { width: win.w, height: win.h };

  return (
    <Rnd
      ref={rndRef}
      position={position}
      size={size}
      minWidth={320}
      minHeight={240}
      bounds="window"
      dragHandleClassName="window__titlebar"
      disableDragging={win.maximized}
      enableResizing={!win.maximized}
      onDragStart={() => setIsInteracting(true)}
      onResizeStart={() => setIsInteracting(true)}
      onDragStop={(_e, d) => {
        setIsInteracting(false);
        moveWindow(win.id, d.x, d.y);
      }}
      onResizeStop={(_e, _direction, ref, _delta, pos) => {
        setIsInteracting(false);
        resizeWindow(
          win.id,
          parseInt(ref.style.width),
          parseInt(ref.style.height)
        );
        moveWindow(win.id, pos.x, pos.y);
      }}
      // react-rnd sets display:inline-block inline; the window needs flex so
      // its content area gets a real height and can scroll.
      style={{ zIndex: win.z, display: "flex" }}
      onMouseDown={() => {
        if (!isFocused) focusWindow(win.id);
      }}
      className={`window ${isFocused ? "window--focused" : "window--unfocused"} ${isClosing ? "window--closing" : ""} ${isOpening ? "window--opening" : ""} ${isInteracting ? "window--interacting" : ""}`}
    >
      <div className="window__titlebar" onDoubleClick={handleMaximize}>
        <WindowControls
          onClose={handleClose}
          onMinimize={handleMinimize}
          onMaximize={handleMaximize}
        />
        <span className="window__title">{win.title}</span>
        <div className="window__controls-spacer" />
      </div>
      <div className="window__content">{renderContent()}</div>
    </Rnd>
  );
}
