// ============================================================
// FileWindow — Displays a file's write-up content
// ============================================================
// Renders basic markdown-like formatting: headings, bold,
// links, lists, tables, and preserves line breaks.

function renderBody(body) {
  if (!body) return null;

  // Process the body line by line for basic formatting
  const lines = body.split("\n");
  const elements = [];
  let inTable = false;
  let tableRows = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      elements.push("</ul>");
      inList = false;
    }
  };

  const processInline = (text) => {
    // Bold: **text**
    text = text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
    // Italic: *text*
    text = text.replace(/\*([^*]+)\*/g, "<em>$1</em>");
    // Links: [text](url)
    text = text.replace(
      /\[([^\]]+)\]\(([^)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    );
    // Inline code: `code`
    text = text.replace(/`([^`]+)`/g, "<code>$1</code>");
    return text;
  };

  const flushTable = () => {
    if (tableRows.length > 0) {
      const headerRow = tableRows[0];
      // Skip separator row (index 1)
      const bodyRows = tableRows.slice(2);
      const headers = headerRow
        .split("|")
        .filter((c) => c.trim())
        .map((c) => c.trim());
      elements.push(
        `<table class="file-window__table"><thead><tr>${headers.map((h) => `<th>${processInline(h)}</th>`).join("")}</tr></thead><tbody>${bodyRows
          .map((row) => {
            const cells = row
              .split("|")
              .filter((c) => c.trim())
              .map((c) => c.trim());
            return `<tr>${cells.map((c) => `<td>${processInline(c)}</td>`).join("")}</tr>`;
          })
          .join("")}</tbody></table>`
      );
      tableRows = [];
    }
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const trimmed = line.trim();

    // Table detection
    if (trimmed.startsWith("|") && trimmed.endsWith("|")) {
      if (!inTable) inTable = true;
      tableRows.push(trimmed);
      continue;
    } else if (inTable) {
      inTable = false;
      flushTable();
    }

    // Empty line ends a list; paragraphs already have their own spacing
    if (trimmed === "") {
      closeList();
      continue;
    }

    // Headings
    if (trimmed.startsWith("## ")) {
      elements.push(`<h3>${processInline(trimmed.slice(3))}</h3>`);
      continue;
    }
    if (trimmed.startsWith("# ")) {
      elements.push(`<h2>${processInline(trimmed.slice(2))}</h2>`);
      continue;
    }

    // Unordered list (consecutive "- " lines share one <ul>)
    if (trimmed.startsWith("- ")) {
      if (!inList) {
        elements.push("<ul>");
        inList = true;
      }
      elements.push(`<li>${processInline(trimmed.slice(2))}</li>`);
      continue;
    }
    closeList();

    // Regular paragraph
    elements.push(`<p>${processInline(trimmed)}</p>`);
  }

  // Flush any remaining table / list
  if (inTable) flushTable();
  closeList();

  return elements.join("");
}

export default function FileWindow({ file }) {
  if (!file) {
    return (
      <div className="file-window">
        <p className="file-window__error">File not found.</p>
      </div>
    );
  }

  return (
    <div className="file-window">
      <div className="file-window__header">
        <h2 className="file-window__title">{file.title || file.name}</h2>
        {file.date && (
          <span className="file-window__date">{file.date}</span>
        )}
      </div>
      <div
        className="file-window__body"
        dangerouslySetInnerHTML={{ __html: renderBody(file.body) }}
      />
      {file.images && file.images.length > 0 && (
        <div className="file-window__images">
          {file.images.map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`${file.title} image ${idx + 1}`}
              className="file-window__image"
            />
          ))}
        </div>
      )}
      {file.links && file.links.length > 0 && (
        <div className="file-window__links">
          <h4>Links</h4>
          <ul>
            {file.links.map((link, idx) => (
              <li key={idx}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label || link.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
