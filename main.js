const setupEvents = require('./installers/setupEvents');
if (setupEvents.handleSquirrelEvent()) {
  return;
}

const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    titleBarStyle: 'hidden',
    icon: path.join(__dirname, 'icons/win/icon-app.ico'),
    backgroundColor: '#141828',
    webPreferences: {
      nodeIntegration: false,
      preload: path.join(__dirname, 'preload.js'), // Update preload path if needed
      nativeWindowOpen: true,
    }
  });

  mainWindow.webContents.on('new-window', (event, url, frameName, disposition, options) => {
    event.preventDefault();
    Object.assign(options, { parent: mainWindow });
    const newWindow = new BrowserWindow(options);
    newWindow.setMenu(null);
    event.newGuest = newWindow;
  });

  mainWindow.loadURL('https://mixer.com/users/login');
  mainWindow.setMenu(null);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'win32') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});
