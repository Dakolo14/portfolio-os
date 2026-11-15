import FileIcon from "./FileIcon";
import { useWindows } from "../state/windowManager";
import { openFile } from "../lib/media";

// ============================================================
// FolderWindow — Shows files inside a folder as an icon grid
// ============================================================

export default function FolderWindow({ folder, isMobile }) {
  const { openWindow } = useWindows();

  const handleOpenFile = (file) => openFile(openWindow, folder, file);

  if (!folder.files || folder.files.length === 0) {
    return (
      <div className="folder-window folder-window--empty">
        <div className="folder-window__empty-state">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity="0.4"
          >
            <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          </svg>
          <p>This folder is empty</p>
        </div>
      </div>
    );
  }

  return (
    <div className="folder-window">
      <div className="folder-window__grid">
        {folder.files.map((file) => (
          <FileIcon
            key={file.id}
            file={file}
            onOpen={handleOpenFile}
            isMobile={isMobile}
          />
        ))}
      </div>
    </div>
  );
}
