// import

const url = require('url');
const path = require('path');
const {app, BrowserWindow, globalShortcut} = require('electron');
const {default: installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS} = require('electron-devtools-installer');

const isDev = require('../common/isDev');

// vars

let mainWindow;

const port = process.env.PORT || 8080;
const hotkey = 'CmdOrCtrl+Alt+W';

// fns

function createWindow() {
  const {height} = require('electron').screen.getPrimaryDisplay().workAreaSize;

  mainWindow = new BrowserWindow({
    x: 0,
    y: 0,
    width: 640,
    height,
    resizable: false,
    maximizable: false,
    movable: false,
    fullscreenable: false,
    skipTaskbar: true,
    show: false,
    webPreferences: {
      devTools: isDev,
    },
  });

  if (isDev) {
    Promise.all([
      installExtension(REACT_DEVELOPER_TOOLS),
      installExtension(REDUX_DEVTOOLS),
    ])
    .catch((err) => console.error(err));
  }

  const indexPath = isDev ? url.format({
    protocol: 'http:',
    host: `localhost:${port}`,
    pathname: 'index.html',
    slashes: true,
  }) : url.format({
    protocol: 'file:',
    pathname: path.join(__dirname, 'build', 'index.html'),
    slashes: true,
  });

  mainWindow.loadURL(indexPath);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();

    if (isDev) {
      mainWindow.webContents.openDevTools({mode: 'detach'});
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// events

app.on('ready', createWindow);

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

app.on('ready', () => {
  globalShortcut.register(hotkey, () => {
    if (mainWindow.isFocused()) {
      mainWindow.hide();
    } else {
      mainWindow.show();
    }
  });
});

app.on('will-quit', () => {
  globalShortcut.unregister(hotkey);
});

// export

module.exports = createWindow;
