# Redux Electron IPC Middleware
[![Build Status](https://travis-ci.org/mariotacke/redux-electron-ipc.svg?branch=master)](https://travis-ci.org/mariotacke/redux-electron-ipc) [![npm version](https://badge.fury.io/js/redux-electron-ipc.svg)](https://badge.fury.io/js/redux-electron-ipc)

A [Redux](https://github.com/reactjs/redux) middleware to reduce code around ipc
calls in an [Electron](http://electron.atom.io/) application. You can send and
receive [IPC](https://github.com/electron/electron/blob/master/docs/api/ipc-main.md)
events with a simple api.

## Install

### [npm](https://www.npmjs.com/package/redux-electron-ipc)
```sh
npm install --save redux-electron-ipc
```

## Usage
Check out the full [demo](https://github.com/mariotacke/redux-electron-ipc/tree/master/example)
application.

### Window
```js
import { applyMiddleware, createStore } from 'redux';
import createIpc from 'redux-electron-ipc';
import { pingActionCreator, pongActionCreator } from './actions';
import { exampleReducer } from './reducer';

// register an action creator to an ipc channel (key/channel, value/action creator)
const ipc = createIpc({
    'pong': pongActionCreator, // receive a message
    ...
});

const store = createStore(exampleReducer, applyMiddleware(ipc));

// send a message with arguments
store.dispatch(pingActionCreator('redux', 'electron', 'ipc'));
```

### Main
```js
const electron = require('electron');
const { ipcMain } = electron;

...

// pong event with arguments back to caller
ipcMain.on('ping', (event, ...args) => {
    console.log('Ping', ...args);
    event.sender.send('pong', ...args);
});
```
