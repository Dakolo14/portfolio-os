import { useState, useEffect } from "react";
import { WindowProvider, useWindows } from "./state/windowManager";
import { ThemeProvider } from "./state/themeManager";
import TopPanel from "./components/TopPanel";
import Dock from "./components/Dock";
import Desktop from "./components/Desktop";
import Window from "./components/Window";
import BootScreen from "./components/BootScreen";

// ============================================================
// App — Main application shell
// ============================================================

function OsShell() {
  const { windows } = useWindows();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="os-shell">
      <TopPanel />
      <Desktop />
      <div className="window-layer">
        {windows.map((win) => (
          <Window key={win.id} win={win} isMobile={isMobile} />
        ))}
      </div>
      <Dock />
    </div>
  );
}

export default function App() {
  const [booted, setBooted] = useState(false);

  return (
    <ThemeProvider>
      {!booted ? (
        <BootScreen onComplete={() => setBooted(true)} />
      ) : (
        <WindowProvider>
          <OsShell />
        </WindowProvider>
      )}
    </ThemeProvider>
  );
}
