import { useState, useRef, useEffect, useCallback } from "react";
import { desktop, owner } from "../data/fileSystem";

// ============================================================
// Terminal — Easter egg terminal emulator
// ============================================================
// Supports: whoami, ls, help, cat <file>, clear, contact, neofetch

const PROMPT = `${owner.username}@${owner.hostname}:~$ `;

const HELP_TEXT = `Available commands:
  help      — Show this help message
  whoami    — Display user info
  ls        — List folders on the desktop
  cat <file> — Read a file (use "ls" to see folders, then "cat folder/file")
  contact   — Show contact information
  neofetch  — System information
  clear     — Clear the terminal`;

const NEOFETCH = `
  ██╗  ██╗ ██████╗ ██╗      █████╗ ██████╗ ███████╗
  ██║ ██╔╝██╔═══██╗██║     ██╔══██╗██╔══██╗██╔════╝
  █████╔╝ ██║   ██║██║     ███████║██║  ██║█████╗  
  ██╔═██╗ ██║   ██║██║     ██╔══██║██║  ██║██╔══╝  
  ██║  ██╗╚██████╔╝███████╗██║  ██║██████╔╝███████╗
  ╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝╚═════╝ ╚══════╝

  OS:       KoladeOS 1.0
  Shell:    portfolio-sh
  Terminal: web-term
  Theme:    Dark GNOME
  Uptime:   Since you opened this page
  Bio:      ${owner.bio}
`;

export default function Terminal() {
  const [history, setHistory] = useState([
    {
      type: "output",
      text: `Welcome to KoladeOS Terminal v1.0\nType "help" for available commands.\n`,
    },
  ]);
  const [input, setInput] = useState("");
  const [cmdHistory, setCmdHistory] = useState([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const executeCommand = useCallback(
    (cmd) => {
      const trimmed = cmd.trim().toLowerCase();
      const parts = trimmed.split(/\s+/);
      const command = parts[0];

      let output = "";

      switch (command) {
        case "":
          break;

        case "help":
          output = HELP_TEXT;
          break;

        case "whoami":
          output = `${owner.name}\n${owner.bio}`;
          break;

        case "ls": {
          const target = parts[1];
          if (target) {
            const folder = desktop.find(
              (f) => f.id === target || f.name.toLowerCase() === target
            );
            if (folder) {
              output =
                folder.files.length > 0
                  ? folder.files.map((f) => `  📄 ${f.name}`).join("\n")
                  : "  (empty folder)";
            } else {
              output = `ls: cannot access '${target}': No such folder`;
            }
          } else {
            output = desktop.map((f) => `  📁 ${f.name} (${f.files.length} files)`).join("\n");
          }
          break;
        }

        case "cat": {
          const path = parts.slice(1).join(" ");
          if (!path) {
            output = "Usage: cat <folder/filename>";
            break;
          }
          // Try to find the file
          let found = false;
          for (const folder of desktop) {
            for (const file of folder.files) {
              const fullPath = `${folder.id}/${file.id}`;
              const namePath = `${folder.name.toLowerCase()}/${file.name.toLowerCase()}`;
              if (
                path === fullPath ||
                path === namePath ||
                path === file.id ||
                path === file.name.toLowerCase()
              ) {
                output = `--- ${file.title} ---\n\n${file.body.replace(/[#*]/g, "")}`;
                found = true;
                break;
              }
            }
            if (found) break;
          }
          if (!found) {
            output = `cat: ${path}: No such file. Try "ls" to see available folders.`;
          }
          break;
        }

        case "contact":
          output = `📧 Email: ${owner.email}\n🌐 Website: kolade.dev\n\n[PLACEHOLDER — add real contact links]`;
          break;

        case "neofetch":
          output = NEOFETCH;
          break;

        case "clear":
          setHistory([]);
          return;

        default:
          output = `${command}: command not found. Type "help" for available commands.`;
      }

      setHistory((prev) => [
        ...prev,
        { type: "input", text: `${PROMPT}${cmd}` },
        ...(output ? [{ type: "output", text: output }] : []),
      ]);
    },
    []
  );

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      executeCommand(input);
      setCmdHistory((prev) => [input, ...prev]);
      setHistoryIndex(-1);
      setInput("");
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (historyIndex < cmdHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(cmdHistory[newIndex]);
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    }
  };

  return (
    <div
      className="terminal"
      onClick={() => inputRef.current?.focus()}
      ref={scrollRef}
    >
      <div className="terminal__output">
        {history.map((entry, i) => (
          <pre
            key={i}
            className={`terminal__line ${entry.type === "input" ? "terminal__line--input" : "terminal__line--output"}`}
          >
            {entry.text}
          </pre>
        ))}
      </div>
      <div className="terminal__input-line">
        <span className="terminal__prompt">{PROMPT}</span>
        <input
          ref={inputRef}
          type="text"
          className="terminal__input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          autoComplete="off"
          spellCheck={false}
        />
      </div>
    </div>
  );
}
