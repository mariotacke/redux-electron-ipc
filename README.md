# Redux Electron IPC Middleware
[![Build Status](https://travis-ci.org/mariotacke/redux-electron-ipc.svg?branch=master)](https://travis-ci.org/mariotacke/redux-electron-ipc) [![npm version](https://badge.fury.io/js/redux-electron-ipc.svg)](https://badge.fury.io/js/redux-electron-ipc) [![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/mariotacke/redux-electron-ipc/master/LICENSE)

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
import createIpc, { send } from 'redux-electron-ipc';
import { pongActionCreator } from './actions';
import { exampleReducer } from './reducer';

// register an action creator to an ipc channel (key/channel, value/action creator)
const ipc = createIpc({
    'pong': pongActionCreator, // receive a message
    ...
});

const store = createStore(exampleReducer, applyMiddleware(ipc));

// send a message with arguments through the `send` utility function
store.dispatch(send('ping', 'redux', 'electron', 'ipc'));
```

### Main
```js
// your regular ipc setup
const electron = require('electron');
const { ipcMain } = electron;

...

// pong event with arguments back to caller
ipcMain.on('ping', (event, ...args) => {
    console.log('Ping', ...args);
    event.sender.send('pong', ...args);
});
```

## API

`redux-electron-ipc` has a default constructor function for creating ipc
middleware, and a named `send` utility function.

```js
createIpc(events?: Object) => IpcMiddleware
send(channel: string, ...arg1?: Object, arg2?: Object, ..., argN?:Object) => Action
```

### Events
Each key on the `events` object (default: `{}`) registers a single ipc channel
response. The key designates the `ipc` channel; the value is a redux action
creator to be dispatched.

```js
{
    'ipc channel name': (event, ...args) => {
        return {
            type: 'YOUR_ACTION_TYPE',
            ... optional mapping of arguments ...
        }
    }
}
```

### Examples

#### Sending an IPC event
Use the utility function `send` to issue an ipc message to the main thread. The
method signature is the same as ipcRenderer's send.

Behind the scenes, the ipc middleware will trigger the ipc on the given channel
with any number of arguments.

```js
import { send } from 'redux-electron-ipc';

store.dispatch(send('ipc event channel', ...args));
```

#### Receiving an IPC event
To receive events, register a channel response when configuring the middleware.

```js
const ipc = createIpc({
    'channel to listen to': () => {
        return {
            action: 'IPC_RESPONSE_ACTION',
            ... optional mapping of arguments ...
        }
    }
    ...
});

const store = createStore(exampleReducer, applyMiddleware(ipc));
```

## Questions
For any questions, please open an [issue](https://github.com/mariotacke/redux-electron-ipc/issues).
Pull requests (with tests) are appreciated.
