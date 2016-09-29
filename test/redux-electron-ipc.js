import { expect } from 'chai';
import { applyMiddleware, createStore } from 'redux';
import proxyquire from 'proxyquire';
import { EventEmitter } from 'events';
import thunk from 'redux-thunk';

// basic event emitter mock to echo ipc requests
class ipcMock extends EventEmitter {
    constructor () {
        super();
    }

    send (channel) {
        this.emit(channel);
    }
}

describe('redux electron ipc', () => {
    let createIpc;
    let send;
    let ipcRenderer;

    beforeEach(() => {
        ipcRenderer = new ipcMock();

        // mock electron ipc event emitter when loading our library
        const lib = proxyquire.noCallThru().load('../dist/electron-redux-ipc', {
            electron: { ipcRenderer }
        });

        createIpc = lib.default;
        send = lib.send;
    });

    describe('createIpc', () => {
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

            // will send ipc message and dispatch registered action on response
            store.dispatch(send('test-channel'));
            expect(store.getState().test).to.equal(1);

            // will send ipc message but receive no response
            store.dispatch(send('unregistered-channel'));
            expect(store.getState().test).to.equal(1);
        });

        it('should work with thunks', () => {
            const testReducer = (state = 0, action) => {
                switch (action.type) {
                    case 'DELAYED_IPC_TEST':
                        return state + 1;
                    default:
                        return state;
                }
            };

            const ipc = createIpc({
                'test-channel': () => dispatch =>
                    dispatch({ type: 'DELAYED_IPC_TEST' })
            });

            const store = createStore(testReducer, applyMiddleware(thunk, ipc));

            expect(store.getState()).to.equal(0);

            store.dispatch(send('test-channel'));
            expect(store.getState()).to.equal(1);
        });

        it('should validate events object', () => {
            expect(() => createIpc(0)).to.throw(TypeError,
                /createIpc expects an events object as its first parameter, you passed type "number"/);
            expect(() => createIpc('invalid')).to.throw(TypeError,
                /createIpc expects an events object as its first parameter, you passed type "string"/);
        });
    });

    describe('send', () => {
        it('should return a dispatch-able ipc action', () => {
            const action = send('test-channel', { key: 'value' }, 'test');

            expect(action.type).to.equal('@@IPC');
            expect(action.channel).to.equal('test-channel');
            expect(action.args.length).to.equal(2);
        });
    });
});
