const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // --- Setup ---
  checkSetup: () => ipcRenderer.invoke('setup:check'),
  runSetup: (backend, onProgress) => {
    ipcRenderer.on('setup:progress', (_, data) => onProgress(data));
    return ipcRenderer.invoke('setup:run', backend);
  },
  cleanupProgressListener: () => ipcRenderer.removeAllListeners('setup:progress'),

  // --- Config ---
  getConfig: () => ipcRenderer.invoke('config:get'),
  saveConfig: (patch) => ipcRenderer.invoke('config:save', patch),

  // --- Models ---
  checkModelCached: (modelId) => ipcRenderer.invoke('model:check', modelId),

  // --- Output folder ---
  getDefaultOutputFolder: ()                     => ipcRenderer.invoke('output:get-default'),
  pickOutputFolder:       ()                     => ipcRenderer.invoke('output:pick-folder'),
  saveFile:               (folder, name, buffer) => ipcRenderer.invoke('output:save-file', { folder, filename: name, buffer }),
  openFolder:             (folder)               => ipcRenderer.invoke('output:open-folder', folder),

  // --- Server ---
  getServerStatus: () => ipcRenderer.invoke('server:status'),
  restartServer: () => ipcRenderer.invoke('server:restart'),
  switchBackend: (backend, onProgress) => {
    ipcRenderer.on('switch:progress', (_, data) => onProgress(data));
    return ipcRenderer.invoke('server:switch-backend', backend);
  },
  cleanupSwitchListener: () => ipcRenderer.removeAllListeners('switch:progress'),

  // --- Events (main → renderer) ---
  onServerReady: (cb) => ipcRenderer.on('server:ready', (_, d) => cb(d)),
  onServerError: (cb) => ipcRenderer.on('server:error', (_, d) => cb(d)),
  removeServerListeners: () => {
    ipcRenderer.removeAllListeners('server:ready');
    ipcRenderer.removeAllListeners('server:error');
  },

  platform: process.platform,
});
