const { app, BrowserWindow, ipcMain, dialog, shell } = require("electron");
const path = require("path");
const fs = require("fs");
let mainWindow;
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1380,
    height: 860,
    minWidth: 1100,
    minHeight: 700,
    frame: false,
    transparent: false,
    backgroundColor: "#0a0e14",
    icon: path.join(__dirname, "../assets/icon.png"),
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: false,
      contextIsolation: true,
    },
    show: false,
  });
  mainWindow.loadFile(path.join(__dirname, "index.html"));
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
}
app.whenReady().then(createWindow);
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});
ipcMain.on("window-minimize", () => mainWindow.minimize());
ipcMain.on("window-maximize", () => {
  if (mainWindow.isMaximized()) mainWindow.unmaximize();
  else mainWindow.maximize();
});
ipcMain.on("window-close", () => mainWindow.close());
ipcMain.handle("save-cfg", async (event, content) => {
  const { filePath, canceled } = await dialog.showSaveDialog(mainWindow, {
    title: "Save CFG File",
    defaultPath: "autoexec.cfg",
    filters: [{ name: "CFG Files", extensions: ["cfg"] }],
  });
  if (canceled || !filePath) return { success: false };
  try {
    fs.writeFileSync(filePath, content, "utf8");
    return { success: true, path: filePath };
  } catch (e) {
    return { success: false, error: e.message };
  }
});
ipcMain.handle("load-cfg", async () => {
  const { filePaths, canceled } = await dialog.showOpenDialog(mainWindow, {
    title: "Open CFG File",
    filters: [{ name: "CFG Files", extensions: ["cfg"] }],
    properties: ["openFile"],
  });
  if (canceled || !filePaths.length) return { success: false };
  try {
    const content = fs.readFileSync(filePaths[0], "utf8");
    return { success: true, content, path: filePaths[0] };
  } catch (e) {
    return { success: false, error: e.message };
  }
});
ipcMain.handle("open-path", async (event, filePath) => {
  shell.showItemInFolder(filePath);
});
