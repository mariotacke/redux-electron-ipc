const electron = require('electron');
const { app, BrowserWindow, ipcMain } = electron;

let win;

app.on('ready', () => {
  win = new BrowserWindow();

  win.loadURL(`file://${__dirname}/dist/index.html`);

  win.webContents.openDevTools();

  win.on('closed', () => {
    win = null;
  });
});

// ping pong event with arguments back to caller
ipcMain.on('ping', (event, arg1, arg2, arg3) => {
  console.log('Ping', arg1, arg2, arg3); // eslint-disable-line no-console
  event.sender.send('pong', arg1, arg2, arg3);
});
