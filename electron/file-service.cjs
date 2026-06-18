const fs = require('node:fs/promises');
const path = require('node:path');

const IMAGE_TYPES = new Map([
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
  ['.webp', 'image/webp'],
  ['.bmp', 'image/bmp'],
  ['.gif', 'image/gif']
]);

function isInsideRoot(candidatePath, rootPath) {
  if (!rootPath) return false;
  const relative = path.relative(path.resolve(rootPath), path.resolve(candidatePath));
  return relative === '' || (!relative.startsWith('..') && !path.isAbsolute(relative));
}

async function collectImages(rootPath) {
  const root = path.resolve(rootPath);
  const rootStat = await fs.stat(root);
  if (!rootStat.isDirectory()) throw new Error('路径不是文件夹');

  const images = [];
  async function visit(directory) {
    const entries = await fs.readdir(directory, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name, 'zh-CN'));
    for (const entry of entries) {
      const fullPath = path.join(directory, entry.name);
      if (entry.isDirectory()) {
        await visit(fullPath);
        continue;
      }
      if (!entry.isFile()) continue;
      const type = IMAGE_TYPES.get(path.extname(entry.name).toLowerCase());
      if (!type) continue;
      const stat = await fs.stat(fullPath);
      images.push({
        path: fullPath,
        name: entry.name,
        relativePath: path.relative(root, fullPath),
        size: stat.size,
        type
      });
    }
  }

  await visit(root);
  return { root, images };
}

module.exports = { IMAGE_TYPES, collectImages, isInsideRoot };
