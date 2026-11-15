import { createContext, useContext, useReducer, useCallback, useEffect } from "react";
import { playWindowOpen, playWindowClose, playMinimize } from "../lib/sounds";

// ============================================================
// Window Manager — React Context + useReducer + localStorage
// ============================================================

const WindowContext = createContext(null);

const CASCADE_OFFSET = 30;
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 450;
const STORAGE_KEY = "koladeOS_windows";

// Action types
const OPEN_WINDOW = "OPEN_WINDOW";
const CLOSE_WINDOW = "CLOSE_WINDOW";
const FOCUS_WINDOW = "FOCUS_WINDOW";
const MINIMIZE_WINDOW = "MINIMIZE_WINDOW";
const RESTORE_WINDOW = "RESTORE_WINDOW";
const MOVE_WINDOW = "MOVE_WINDOW";
const RESIZE_WINDOW = "RESIZE_WINDOW";
const MAXIMIZE_WINDOW = "MAXIMIZE_WINDOW";
const HYDRATE = "HYDRATE";

function getNextZ(windows) {
  if (windows.length === 0) return 100;
  return Math.max(...windows.map((w) => w.z)) + 1;
}

function getCascadePosition(windows, width, height) {
  const openCount = windows.filter((w) => !w.minimized).length;
  const screenW = typeof window !== "undefined" ? window.innerWidth : 1024;
  const screenH = typeof window !== "undefined" ? window.innerHeight : 768;
  const startX = Math.max(0, (screenW - width) / 2);
  const startY = Math.max(0, (screenH - height) / 2);
  const offset = (openCount % 8) * CASCADE_OFFSET;
  return { x: startX + offset, y: startY + offset };
}

function windowReducer(state, action) {
  switch (action.type) {
    case HYDRATE: {
      // Saved positions may come from a bigger screen; pull windows back
      // into view so none are stranded off-screen after a reload.
      const maxX = Math.max(0, window.innerWidth - 120);
      const maxY = Math.max(0, window.innerHeight - 140);
      return (action.payload || []).map((w) => ({
        ...w,
        x: Math.min(Math.max(0, w.x), maxX),
        y: Math.min(Math.max(0, w.y), maxY),
      }));
    }

    case OPEN_WINDOW: {
      const w = action.payload.w || DEFAULT_WIDTH;
      const h = action.payload.h || DEFAULT_HEIGHT;

      const existing = state.find((win) => win.id === action.payload.id);
      if (existing) {
        return state.map((win) =>
          win.id === action.payload.id
            ? { ...win, minimized: false, z: getNextZ(state) }
            : win
        );
      }

      const pos = getCascadePosition(state, w, h);
      return [
        ...state,
        {
          id: action.payload.id,
          kind: action.payload.kind,
          folderId: action.payload.folderId || null,
          fileId: action.payload.fileId || null,
          title: action.payload.title,
          x: pos.x,
          y: pos.y,
          w,
          h,
          z: getNextZ(state),
          minimized: false,
          maximized: false,
        },
      ];
    }

    case CLOSE_WINDOW:
      return state.filter((w) => w.id !== action.payload.id);

    case FOCUS_WINDOW:
      return state.map((w) =>
        w.id === action.payload.id ? { ...w, z: getNextZ(state) } : w
      );

    case MINIMIZE_WINDOW:
      return state.map((w) =>
        w.id === action.payload.id ? { ...w, minimized: true } : w
      );

    case RESTORE_WINDOW:
      return state.map((w) =>
        w.id === action.payload.id
          ? { ...w, minimized: false, z: getNextZ(state) }
          : w
      );

    case MOVE_WINDOW:
      return state.map((w) =>
        w.id === action.payload.id
          ? { ...w, x: action.payload.x, y: action.payload.y }
          : w
      );

    case RESIZE_WINDOW:
      return state.map((w) =>
        w.id === action.payload.id
          ? { ...w, w: action.payload.w, h: action.payload.h }
          : w
      );

    case MAXIMIZE_WINDOW:
      return state.map((w) =>
        w.id === action.payload.id ? { ...w, maximized: !w.maximized } : w
      );

    default:
      return state;
  }
}

// Load saved windows from localStorage
function loadWindows() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return [];
}

export function WindowProvider({ children }) {
  const [windows, dispatch] = useReducer(windowReducer, []);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadWindows();
    if (saved.length > 0) {
      dispatch({ type: HYDRATE, payload: saved });
    }
  }, []);

  // Persist to localStorage whenever windows change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(windows));
    } catch { /* ignore */ }
  }, [windows]);

  const openWindow = useCallback((payload) => {
    playWindowOpen();
    dispatch({ type: OPEN_WINDOW, payload });
  }, []);

  const closeWindow = useCallback((id) => {
    playWindowClose();
    dispatch({ type: CLOSE_WINDOW, payload: { id } });
  }, []);

  const focusWindow = useCallback(
    (id) => dispatch({ type: FOCUS_WINDOW, payload: { id } }),
    []
  );

  const minimizeWindow = useCallback((id) => {
    playMinimize();
    dispatch({ type: MINIMIZE_WINDOW, payload: { id } });
  }, []);

  const restoreWindow = useCallback(
    (id) => dispatch({ type: RESTORE_WINDOW, payload: { id } }),
    []
  );

  const moveWindow = useCallback(
    (id, x, y) => dispatch({ type: MOVE_WINDOW, payload: { id, x, y } }),
    []
  );

  const resizeWindow = useCallback(
    (id, w, h) => dispatch({ type: RESIZE_WINDOW, payload: { id, w, h } }),
    []
  );

  const maximizeWindow = useCallback(
    (id) => dispatch({ type: MAXIMIZE_WINDOW, payload: { id } }),
    []
  );

  const focusedId =
    windows.length > 0
      ? [...windows]
          .filter((w) => !w.minimized)
          .sort((a, b) => b.z - a.z)[0]?.id || null
      : null;

  return (
    <WindowContext.Provider
      value={{
        windows,
        focusedId,
        openWindow,
        closeWindow,
        focusWindow,
        minimizeWindow,
        restoreWindow,
        moveWindow,
        resizeWindow,
        maximizeWindow,
      }}
    >
      {children}
    </WindowContext.Provider>
  );
}

export function useWindows() {
  const ctx = useContext(WindowContext);
  if (!ctx) throw new Error("useWindows must be used inside WindowProvider");
  return ctx;
}
