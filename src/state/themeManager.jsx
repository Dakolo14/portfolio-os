import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { setSoundEnabled } from "../lib/sounds";

// ============================================================
// Theme Manager — Appearance, icon size, sound toggle
// ============================================================

const ThemeContext = createContext(null);

const STORAGE_KEY = "koladeOS_theme";

const THEMES = {
  dark: {
    id: "dark",
    label: "Dark",
    panelBg: "rgba(24, 24, 27, 0.65)",
    panelBorder: "rgba(255, 255, 255, 0.1)",
    windowBg: "#1e1e24",
    windowBorder: "rgba(255, 255, 255, 0.1)",
    titlebarBg: "#2d2d34",
    titlebarUnfocused: "#25252b",
    textPrimary: "#f4f4f5",
    textSecondary: "#a1a1aa",
    accent: "#6366f1",
    fileBg: "#1a1a1f",
    terminalBg: "#1e1e1e",
    bodyBg: "#000",
  },
  light: {
    id: "light",
    label: "Light",
    panelBg: "rgba(240, 240, 245, 0.75)",
    panelBorder: "rgba(0, 0, 0, 0.1)",
    windowBg: "#ffffff",
    windowBorder: "rgba(0, 0, 0, 0.12)",
    titlebarBg: "#e8e8ec",
    titlebarUnfocused: "#f0f0f3",
    textPrimary: "#1a1a2e",
    textSecondary: "#6b6b80",
    accent: "#4f46e5",
    fileBg: "#fafafa",
    terminalBg: "#1e1e1e",
    bodyBg: "#c0c0c8",
  },
  ocean: {
    id: "ocean",
    label: "Ocean",
    panelBg: "rgba(10, 25, 47, 0.7)",
    panelBorder: "rgba(100, 200, 255, 0.15)",
    windowBg: "#0d1b2a",
    windowBorder: "rgba(100, 200, 255, 0.1)",
    titlebarBg: "#1b2838",
    titlebarUnfocused: "#152232",
    textPrimary: "#e0f0ff",
    textSecondary: "#7ba3c9",
    accent: "#38bdf8",
    fileBg: "#0a1628",
    terminalBg: "#0a1628",
    bodyBg: "#020810",
  },
  forest: {
    id: "forest",
    label: "Forest",
    panelBg: "rgba(15, 30, 15, 0.7)",
    panelBorder: "rgba(100, 200, 100, 0.15)",
    windowBg: "#1a2e1a",
    windowBorder: "rgba(100, 200, 100, 0.1)",
    titlebarBg: "#243524",
    titlebarUnfocused: "#1e2d1e",
    textPrimary: "#e0f5e0",
    textSecondary: "#7baa7b",
    accent: "#4ade80",
    fileBg: "#152415",
    terminalBg: "#0f1a0f",
    bodyBg: "#050a05",
  },
  sunset: {
    id: "sunset",
    label: "Sunset",
    panelBg: "rgba(40, 15, 25, 0.7)",
    panelBorder: "rgba(255, 150, 100, 0.15)",
    windowBg: "#2a1520",
    windowBorder: "rgba(255, 150, 100, 0.1)",
    titlebarBg: "#3a1f2a",
    titlebarUnfocused: "#2f1825",
    textPrimary: "#ffe8e0",
    textSecondary: "#c98a7b",
    accent: "#fb923c",
    fileBg: "#221018",
    terminalBg: "#1a0d14",
    bodyBg: "#0a0408",
  },
};

const ICON_SIZES = {
  small: { desktop: 48, container: 60, dock: 28, text: "0.65rem", label: "Small" },
  medium: { desktop: 72, container: 80, dock: 36, text: "0.75rem", label: "Medium" },
  large: { desktop: 96, container: 110, dock: 44, text: "0.85rem", label: "Large" },
};

function loadSettings() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
  } catch { /* ignore */ }
  return { themeId: "dark", iconSize: "medium", soundEnabled: true };
}

function applyThemeToDOM(theme) {
  const root = document.documentElement;
  root.style.setProperty("--panel-bg", theme.panelBg);
  root.style.setProperty("--panel-border", theme.panelBorder);
  root.style.setProperty("--window-bg", theme.windowBg);
  root.style.setProperty("--window-border", theme.windowBorder);
  root.style.setProperty("--titlebar-bg", theme.titlebarBg);
  root.style.setProperty("--titlebar-unfocused", theme.titlebarUnfocused);
  root.style.setProperty("--text-primary", theme.textPrimary);
  root.style.setProperty("--text-secondary", theme.textSecondary);
  root.style.setProperty("--accent", theme.accent);
  root.style.setProperty("--file-bg", theme.fileBg);
  root.style.setProperty("--terminal-bg", theme.terminalBg);
  root.style.setProperty("--body-bg", theme.bodyBg);
}

function applyIconSizeToDOM(sizeKey) {
  const size = ICON_SIZES[sizeKey] || ICON_SIZES.medium;
  const root = document.documentElement;
  root.style.setProperty("--icon-desktop-size", `${size.desktop}px`);
  root.style.setProperty("--icon-container-size", `${size.container}px`);
  root.style.setProperty("--icon-text-size", size.text);
  root.style.setProperty("--icon-dock-size", `${size.dock}px`);
}

export function ThemeProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  const theme = THEMES[settings.themeId] || THEMES.dark;

  // Apply theme + icon size on mount and change
  useEffect(() => {
    applyThemeToDOM(theme);
    applyIconSizeToDOM(settings.iconSize);
  }, [theme, settings.iconSize]);

  useEffect(() => {
    setSoundEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Persist
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch { /* ignore */ }
  }, [settings]);

  // Handle system preference
  useEffect(() => {
    if (settings.themeId !== "system") return;
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const handler = (e) => {
      applyThemeToDOM(e.matches ? THEMES.dark : THEMES.light);
    };
    handler(mq);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [settings.themeId]);

  const setTheme = useCallback((themeId) => {
    if (themeId === "system") {
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      applyThemeToDOM(prefersDark ? THEMES.dark : THEMES.light);
    }
    setSettings((s) => ({ ...s, themeId }));
  }, []);

  const setIconSize = useCallback((iconSize) => {
    setSettings((s) => ({ ...s, iconSize }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings((s) => ({ ...s, soundEnabled: !s.soundEnabled }));
  }, []);

  return (
    <ThemeContext.Provider
      value={{
        themeId: settings.themeId,
        theme,
        themes: THEMES,
        iconSize: settings.iconSize,
        iconSizes: ICON_SIZES,
        soundEnabled: settings.soundEnabled,
        setTheme,
        setIconSize,
        toggleSound,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside ThemeProvider");
  return ctx;
}
