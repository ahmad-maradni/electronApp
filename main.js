"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var electron_1 = require("electron");
var path = require("path");
var url = require("url");
var autoUpdater = require("electron-updater").autoUpdater;
var win, serve;
var args = process.argv.slice(1);
serve = args.some(function (val) { return val === '--serve'; });
function createWindow() {
    var electronScreen = electron_1.screen;
    var size = electronScreen.getPrimaryDisplay().workAreaSize;
    // Create the browser window.
    win = new electron_1.BrowserWindow({
        x: 0,
        y: 0,
        width: size.width,
        height: size.height,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    if (serve) {
        require('electron-reload')(__dirname, {
            electron: require(__dirname + "/node_modules/electron")
        });
        win.loadURL('http://localhost:4200');
    }
    else {
        win.loadURL(url.format({
            pathname: path.join(__dirname, 'dist/index.html'),
            protocol: 'file:',
            slashes: true
        }));
    }
    if (serve) {
        win.webContents.openDevTools();
    }
    win.on('closed', function () {
        win = null;
    });
}
var createDefaultWindow = function () {
    win.on('closed', function () {
        win = null;
    });
    win.loadFile('ز/index.html');
    return win;
};
try {
    electron_1.app.on('ready', createWindow);
    createDefaultWindow();
    autoUpdater.checkForUpdatesAndNotify();
    win.webContents.send('version', electron_1.app.getVersion());
    // Quit when all windows are closed.
    electron_1.app.on('window-all-closed', function () {
        if (process.platform !== 'darwin') {
            electron_1.app.quit();
        }
    });
    electron_1.app.on('activate', function () {
        if (win === null) {
            createWindow();
        }
    });
}
catch (e) {
    // Catch Error
    // throw e;
}
var dispatch = function (data) {
    win.webContents.send('message', data);
};
electron_1.app.on('window-all-closed', function () {
    electron_1.app.quit();
});
autoUpdater.on('checking-for-update', function () {
    dispatch('Checking for update...');
});
autoUpdater.on('update-available', function (info) {
    dispatch('Update available.');
});
autoUpdater.on('update-not-available', function (info) {
    dispatch('Update not available.');
});
autoUpdater.on('error', function (err) {
    dispatch('Error in auto-updater. ' + err);
});
autoUpdater.on('download-progress', function (progressObj) {
    // let log_message = "Download speed: " + progressObj.bytesPerSecond
    // log_message = log_message + ' - Downloaded ' + progressObj.percent + '%'
    // log_message = log_message + ' (' + progressObj.transferred + "/" + progressObj.total + ')'
    // dispatch(log_message)
    win.webContents.send('download-progress', progressObj.percent);
});
autoUpdater.on('update-downloaded', function (info) {
    dispatch('Update downloaded');
});
//# sourceMappingURL=main.js.map