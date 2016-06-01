import { expect } from 'chai';
import { applyMiddleware, createStore } from 'redux';
import proxyquire from 'proxyquire';
import { EventEmitter } from 'events';

// basic event emitter mock to echo ipc requests
class ipcMock extends EventEmitter {
    constructor () {
        super();
    }

    send (channel) {
        this.emit(channel);
    }
}

describe('createIpc', () => {
    let createIpc;
    let ipcRenderer;

    beforeEach(() => {
        ipcRenderer = new ipcMock();

        // mock electron ipc event emitter when loading our library
        createIpc = proxyquire.noCallThru().load('../dist/electron-redux-ipc.js', {
            electron: { ipcRenderer }
        });
    });

    it('should fire registered ipc event handlers', () => {
        const testReducer = (state = { test: 0 }, action) => {
            switch (action.type) {
                case 'IPC_TEST':
                    return { test: state.test + 1 };
                default:
                    return state;
            }
        };

        const ipc = createIpc({
            'test-channel': () => { return { type: 'IPC_TEST' }; }
        });

        const store = createStore(testReducer, applyMiddleware(ipc));

        expect(store.getState().test).to.equal(0);

        // directly invoking a specific emit on the ipc
        ipcRenderer.emit('test-channel');
        expect(store.getState().test).to.equal(1);

        // proxy emitting through redux-electron-ipc
        store.dispatch({ type: 'IPC_ECHO', channel: 'test-channel' });
        expect(store.getState().test).to.equal(2);

        // test unregistered channel
        ipcRenderer.emit('unknown-channel');
        expect(store.getState().test).to.equal(2);

        // proxy test unregistered channel
        store.dispatch({ type: 'IPC_ECHO', channel: 'unknown-channel' });
        expect(store.getState().test).to.equal(2);
    });
});
