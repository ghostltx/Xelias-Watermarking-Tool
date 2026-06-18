const { contextBridge, ipcRenderer, webUtils } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  chooseDirectory: () => ipcRenderer.invoke('folder:choose'),
  loadDirectory: folderPath => ipcRenderer.invoke('folder:load', folderPath),
  readImage: imagePath => ipcRenderer.invoke('image:read', imagePath),
  writeImage: (imagePath, bytes) => ipcRenderer.invoke('image:write', imagePath, bytes),
  getDroppedPath: file => webUtils.getPathForFile(file)
});
