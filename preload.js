const { contextBridge, ipcRenderer } = require("electron");
contextBridge.exposeInMainWorld("electronAPI", {
  minimize: () => ipcRenderer.send("window-minimize"),
  maximize: () => ipcRenderer.send("window-maximize"),
  close: () => ipcRenderer.send("window-close"),
  saveCfg: (content) => ipcRenderer.invoke("save-cfg", content),
  loadCfg: () => ipcRenderer.invoke("load-cfg"),
  openPath: (path) => ipcRenderer.invoke("open-path", path),
});
