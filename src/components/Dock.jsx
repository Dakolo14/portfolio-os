import { desktop } from "../data/fileSystem";
import { useWindows } from "../state/windowManager";
import { getFolderIcon } from "../lib/getFolderIcon";
import { playClick } from "../lib/sounds";

// ============================================================
// Dock — Bottom-center dock with folders + About + Portfolio
// ============================================================

export default function Dock() {
  const { windows, openWindow, focusWindow, restoreWindow, minimizeWindow } =
    useWindows();

  const handleDockClick = (folder) => {
    playClick();
    const existingWindow = windows.find(
      (w) => w.kind === "folder" && w.folderId === folder.id
    );

    if (existingWindow) {
      if (existingWindow.minimized) {
        restoreWindow(existingWindow.id);
      } else {
        minimizeWindow(existingWindow.id);
      }
    } else {
      openWindow({
        id: `folder-${folder.id}`,
        kind: "folder",
        folderId: folder.id,
        title: folder.name,
        w: 550,
        h: 400,
      });
    }
  };

  const handleSpecialClick = (id, kind, folderId, fileId, title) => {
    playClick();
    const existingWindow = windows.find((w) => w.id === id);
    if (existingWindow) {
      if (existingWindow.minimized) {
        restoreWindow(existingWindow.id);
      } else {
        focusWindow(existingWindow.id);
      }
    } else {
      openWindow({ id, kind, folderId, fileId, title, w: 600, h: 500 });
    }
  };
  
  const handleHomeClick = () => {
    playClick();
    // Minimize all open windows to show the desktop/home
    windows.forEach((w) => {
      if (!w.minimized) {
        minimizeWindow(w.id);
      }
    });
  };

  const getWindowState = (folderId) => {
    const win = windows.find(
      (w) => w.kind === "folder" && w.folderId === folderId
    );
    if (!win) return "closed";
    if (win.minimized) return "minimized";
    return "open";
  };

  const isWindowOpen = (id) => {
    return windows.some((w) => w.id === id && !w.minimized);
  };

  return (
    <div className="dock">
      <div className="dock__container">
      
        {/* 1. Home */}
        <button
          className="dock__item"
          onClick={handleHomeClick}
          title="Home"
        >
          <div className="dock__icon-wrapper">
            <div className="dock__special-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </div>
          </div>
          <span className="dock__label">Home</span>
        </button>

        {/* 2. About / Profile */}
        <button
          className={`dock__item ${isWindowOpen("file-resume") ? "dock__item--active" : ""}`}
          onClick={() =>
            handleSpecialClick("file-resume", "file", "contact", "resume", "About Me")
          }
          title="About Me"
        >
          <div className="dock__icon-wrapper">
            <div className="dock__special-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>
          </div>
          <span className="dock__label">About</span>
          {windows.some((w) => w.id === "file-resume") && (
            <span className="dock__indicator" />
          )}
        </button>
        
        {/* 3. Portfolio / Work — opens worldwideadhd folder */}
        <button
          className={`dock__item ${isWindowOpen("folder-worldwideadhd") ? "dock__item--active" : ""}`}
          onClick={() => {
            const folder = desktop.find((f) => f.id === "worldwideadhd");
            if (folder) handleDockClick(folder);
          }}
          title="Portfolio"
        >
          <div className="dock__icon-wrapper">
            <div className="dock__special-icon">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
              </svg>
            </div>
          </div>
          <span className="dock__label">Portfolio</span>
          {windows.some((w) => w.id === "folder-worldwideadhd") && (
            <span className="dock__indicator" />
          )}
        </button>

        {/* 4. Other Folder launchers (excluding worldwideadhd) */}
        {desktop.filter((f) => f.id !== "worldwideadhd").map((folder) => {
          const windowState = getWindowState(folder.id);
          return (
            <button
              key={folder.id}
              className={`dock__item ${windowState !== "closed" ? "dock__item--active" : ""}`}
              onClick={() => handleDockClick(folder)}
              title={folder.name}
            >
              <div className="dock__icon-wrapper">
                <img
                  src={getFolderIcon(folder.files.length)}
                  alt={folder.name}
                  className="dock__icon"
                  draggable={false}
                />
              </div>
              <span className="dock__label">{folder.name}</span>
              {windowState !== "closed" && (
                <span
                  className={`dock__indicator ${windowState === "minimized" ? "dock__indicator--minimized" : ""}`}
                />
              )}
            </button>
          );
        })}

        {/* 5. Terminal launcher */}
        <button
          className={`dock__item ${windows.find((w) => w.kind === "terminal") ? "dock__item--active" : ""}`}
          onClick={() => {
            playClick();
            openWindow({
              id: "terminal",
              kind: "terminal",
              title: "Terminal",
              w: 600,
              h: 400,
            });
          }}
          title="Terminal"
        >
          <div className="dock__icon-wrapper">
            <div className="dock__special-icon dock__special-icon--terminal">
              <span>&gt;_</span>
            </div>
          </div>
          <span className="dock__label">Terminal</span>
          {windows.find((w) => w.kind === "terminal") && (
            <span className="dock__indicator" />
          )}
        </button>
      </div>
    </div>
  );
}
