const { app, BrowserWindow, ipcMain, Tray, Menu } = require('electron');
const path = require('path');

let mainWindow;
let tray;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false, // Make the window frameless
    resizable: false, // Make the window not resizable
    transparent: true, // Make the window transparent
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, '..', '..', 'ASSETS', 'ICONS', 'FAVICONS', 'FAVICON1.ico')
  });

  mainWindow.loadFile(path.join(__dirname, '..', '..', 'INDEX.html'));

  // Open DevTools automatically if in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
  });

  mainWindow.on('minimize', function (event) {
    event.preventDefault();
    mainWindow.hide();
  });

  mainWindow.on('close', function (event) {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  createTray();
}

function createTray() {
  tray = new Tray(path.join(__dirname, '..', '..', 'ASSETS', 'ICONS', 'FAVICONS', 'FAVICON1.ico'));
  const contextMenu = Menu.buildFromTemplate([
    // Removed the 'Show App' option
    { 
      label: 'Quit', click: function() {
        app.isQuitting = true;
        app.quit();
      } 
    }
  ]);

  tray.setToolTip('My Electron App');
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
  if (mainWindow === null) createWindow();
});

// Hot reload setup
if (process.env.NODE_ENV === 'development') {
  app.on('ready', () => {
    const { watchFile } = require('fs');
    const htmlPath = path.join(__dirname, '..', '..', 'INDEX.html');
    const cssPath = path.join(__dirname, '..', 'SASS', 'STYLES.sass');
    const jsPath = path.join(__dirname, 'RENDERER.js');
    const preloadPath = path.join(__dirname, 'PRELOAD.js');

    watchFile(htmlPath, () => mainWindow.reload());
    watchFile(cssPath, () => mainWindow.webContents.reloadIgnoringCache());
    watchFile(jsPath, () => mainWindow.webContents.reloadIgnoringCache());
    watchFile(preloadPath, () => {
      mainWindow.close();
      createWindow();
    });
  });
}

// Add these IPC handlers for window controls
ipcMain.on('minimize-window', () => {
  mainWindow.hide();
});

// Removed maximize-window IPC handler

ipcMain.on('close-window', () => {
  app.isQuitting = true;
  app.quit();
});

// Add this new IPC handler for the titlebar icon context menu
ipcMain.on('show-titlebar-icon-menu', (event) => {
  const template = [
    { 
      label: 'Quit', 
      click: () => {
        app.isQuitting = true;
        app.quit();
      } 
    }
  ];
  const menu = Menu.buildFromTemplate(template);
  menu.popup({ window: mainWindow });
});
