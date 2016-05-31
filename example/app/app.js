import { applyMiddleware, createStore } from 'redux';
import createIpc from '../../';
import { pingActionCreator, pongActionCreator } from './actions';
import { exampleReducer } from './reducer';

const ipc = createIpc({
    'pong': pongActionCreator // eslint-disable-line quote-props
});
const store = createStore(exampleReducer, applyMiddleware(ipc));

store.dispatch(pingActionCreator('redux', 'electron', 'ipc'));
