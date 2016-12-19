import { applyMiddleware, createStore } from 'redux';
import createIpc, { send } from '../../';

function exampleReducer (state = {}, action) {
  switch (action.type) {
    case 'IPC_PONG':
      console.log('Pong', action); // eslint-disable-line no-console
      return state;
    default:
      return state;
  }
}

function pongActionCreator (event, arg1, arg2, arg3) {
  return {
    type: 'IPC_PONG',
    arg1,
    arg2,
    arg3
  };
}

const ipc = createIpc({
  'pong': pongActionCreator // eslint-disable-line quote-props
});

const store = createStore(exampleReducer, applyMiddleware(ipc));

store.dispatch(send('ping', 'redux', 'electron', 'ipc'));
