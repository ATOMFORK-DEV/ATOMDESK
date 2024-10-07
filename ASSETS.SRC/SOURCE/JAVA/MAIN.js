const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    // Add this line to set the icon
    icon: path.join(__dirname, '..', '..', 'ASSETS', 'ICONS', 'FAVICONS', 'FAVICON.ico')
  });

  mainWindow.loadFile(path.join(__dirname, '..', '..', 'INDEX.html'));

  // Open DevTools automatically if in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  mainWindow.on('closed', function () {
    mainWindow = null;
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
