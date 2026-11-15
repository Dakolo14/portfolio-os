// ============================================================
// media.js — File types, YouTube helpers, and a shared "open file"
// ============================================================

const IMAGE_EXT = ["jpg", "jpeg", "png", "gif", "webp", "avif", "svg"];
const VIDEO_EXT = ["mp4", "webm", "mov", "m4v"];

function extOf(path = "") {
  const clean = path.split(/[?#]/)[0];
  const dot = clean.lastIndexOf(".");
  return dot === -1 ? "" : clean.slice(dot + 1).toLowerCase();
}

/** Returns the YouTube video id for a youtube.com / youtu.be URL, else null. */
export function getYouTubeId(url = "") {
  const m = String(url).match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/|live\/)|youtu\.be\/)([\w-]{11})/
  );
  return m ? m[1] : null;
}

export function youTubeEmbedUrl(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`;
}

export function youTubeThumbUrl(id) {
  return `https://i.ytimg.com/vi/${id}/hqdefault.jpg`;
}

/**
 * Works out what kind of file this is: "image", "video" or "text".
 * An explicit `type` wins; otherwise we look at `youtube`, then the
 * extension of `src`, then the extension of the file name.
 */
export function getFileType(file) {
  if (!file) return "text";
  if (file.type) return file.type;
  if (file.youtube) return "video";
  const ext = extOf(file.src) || extOf(file.name);
  if (IMAGE_EXT.includes(ext)) return "image";
  if (VIDEO_EXT.includes(ext)) return "video";
  return "text";
}

export function isMediaSrcVideo(src) {
  return Boolean(getYouTubeId(src)) || VIDEO_EXT.includes(extOf(src));
}

/** Opens the right kind of window for a file inside a folder. */
export function openFile(openWindow, folder, file) {
  const type = getFileType(file);
  const base = {
    id: `file-${folder.id}-${file.id}`,
    folderId: folder.id,
    fileId: file.id,
    title: file.name,
  };
  if (type === "image") {
    openWindow({ ...base, kind: "image", w: 760, h: 560 });
  } else if (type === "video") {
    openWindow({ ...base, kind: "video", w: 800, h: 500 });
  } else {
    openWindow({ ...base, id: `file-${file.id}`, kind: "file", w: 600, h: 500 });
  }
}
