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

## API

`redux-electron-ipc` has a single constructor function for creating ipc
middleware.

```js
createIpc(events?: Object, prefix?: string) => IpcMiddleware
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

### Prefix
The optional prefix (default: `IPC_`) determines which actions to forward to ipc
when dispatched through the redux store.

### Examples

#### Sending an IPC event
The following `dispatch` will be intercepted by the `redux electron ipc`
middleware and triggers an ipc event because the action type is in the form of
`IPC_`... and a `channel` is specified. Arguments to the ipc are passed via the
`args` array of the action.

```js
store.dispatch({
    type: IPC_ACTION_NAME, // IPC_ prefix + action name
    channel: 'ipc event channel',
    args: [
        payload: {
            key: value
        }
    ]
});
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
