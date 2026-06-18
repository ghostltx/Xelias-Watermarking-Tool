const { app, BrowserWindow, dialog, ipcMain } = require('electron');
const fs = require('node:fs/promises');
const path = require('node:path');
const { collectImages, isInsideRoot } = require('./file-service.cjs');

let activeRoot = null;

function registerIpcHandlers() {
  ipcMain.handle('folder:choose', async () => {
    const result = await dialog.showOpenDialog({
      properties: ['openDirectory'],
      title: '选择原图片文件夹'
    });
    if (result.canceled || !result.filePaths[0]) return null;
    const collected = await collectImages(result.filePaths[0]);
    activeRoot = collected.root;
    return collected;
  });

  ipcMain.handle('folder:load', async (_event, folderPath) => {
    if (typeof folderPath !== 'string' || !folderPath.trim()) {
      throw new Error('请输入文件夹路径');
    }
    const collected = await collectImages(folderPath.trim().replace(/^["']|["']$/g, ''));
    activeRoot = collected.root;
    return collected;
  });

  ipcMain.handle('image:read', async (_event, imagePath) => {
    const resolved = path.resolve(imagePath);
    if (!isInsideRoot(resolved, activeRoot)) throw new Error('图片不在当前导入文件夹内');
    return fs.readFile(resolved);
  });

  ipcMain.handle('image:write', async (_event, imagePath, bytes) => {
    const resolved = path.resolve(imagePath);
    if (!isInsideRoot(resolved, activeRoot)) throw new Error('禁止写入当前导入文件夹之外的路径');
    await fs.writeFile(resolved, Buffer.from(bytes));
    return true;
  });
}

function createWindow() {
  const window = new BrowserWindow({
    width: 1440,
    height: 900,
    minWidth: 980,
    minHeight: 720,
    backgroundColor: '#e9f5ff',
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true
    }
  });

  window.loadFile(path.join(__dirname, '..', 'index.html'));
}

app.whenReady().then(() => {
  registerIpcHandlers();
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
