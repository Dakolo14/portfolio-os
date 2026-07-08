// getFolderIcon.js — Maps file count to the correct folder icon PNG
// Uses the exact filenames: emptyfolder.png, 1file.png, 2files.png, 3files.png

/**
 * Returns the folder icon image source based on the number of files.
 * @param {number} fileCount - The number of files in the folder
 * @returns {string} The image path for the correct folder icon
 */
export function getFolderIcon(fileCount) {
  if (fileCount === 0) return "/emptyfolder.png";
  if (fileCount === 1) return "/1file.png";
  if (fileCount === 2) return "/2files.png";
  return "/3files.png"; // 3 or more
}
