const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const os = require('node:os');
const path = require('node:path');
const { collectImages, isInsideRoot, IMAGE_TYPES } = require('../electron/file-service.cjs');

test('path guard accepts descendants and rejects sibling paths', () => {
  const root = path.resolve('C:/images');
  assert.equal(isInsideRoot(path.join(root, 'nested', 'a.png'), root), true);
  assert.equal(isInsideRoot(path.resolve('C:/other/a.png'), root), false);
});

test('image extension allowlist covers common ecommerce formats', () => {
  for (const extension of ['.jpg', '.jpeg', '.png', '.webp', '.bmp', '.gif']) {
    assert.equal(IMAGE_TYPES.has(extension), true, `${extension} should be supported`);
  }
});

test('folder scan recursively returns images and ignores other files', async () => {
  const root = await fs.mkdtemp(path.join(os.tmpdir(), 'xelias-electron-'));
  const nested = path.join(root, 'nested');
  await fs.mkdir(nested);
  await fs.writeFile(path.join(nested, 'sample.png'), Buffer.from([137, 80, 78, 71]));
  await fs.writeFile(path.join(root, 'photo.JPG'), Buffer.from([255, 216, 255]));
  await fs.writeFile(path.join(root, 'notes.txt'), 'ignore me');

  const result = await collectImages(root);
  assert.equal(result.root, path.resolve(root));
  assert.deepEqual(result.images.map(item => item.relativePath).sort(), [
    'nested\\sample.png',
    'photo.JPG'
  ]);

  await fs.rm(path.join(nested, 'sample.png'));
  await fs.rm(path.join(root, 'photo.JPG'));
  await fs.rm(path.join(root, 'notes.txt'));
  await fs.rmdir(nested);
  await fs.rmdir(root);
});

test('renderer includes Electron path and folder-drop integration', async () => {
  const html = await fs.readFile(path.join(__dirname, '..', 'index.html'), 'utf8');
  assert.match(html, /id="folderPathInput"/);
  assert.match(html, /window\.electronAPI\.getDroppedPath/);
  assert.match(html, /window\.electronAPI\.writeImage/);
});
