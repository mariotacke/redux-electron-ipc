import { ipcRenderer as ipc } from 'electron';

export default function createIpc (events = {}) {
  if (typeof events !== 'object') {
    throw new TypeError(`createIpc expects an events object as its first parameter, you passed type "${typeof events}"`);
  }

  Object.keys(events).forEach(key => {
    if (typeof events[key] !== 'function') {
      throw new TypeError(`Each key in createIpc's events object must be a dispatch-able function, key "${key}" is of type "${typeof events[key]}"`);
    }
  });

  return ({ dispatch }) => {
    Object.keys(events).forEach((key) => {
      ipc.on(key, function () {
        dispatch(events[key](...arguments));
      });
    });

    return function (next) {
      return function (action) {
        if (action.type.startsWith('@@IPC')) {
          ipc.send(action.channel, ...(action.args || []));
        }

        return next(action);
      };
    };
  };
}

export function send (channel) {
  return {
    type: '@@IPC',
    channel,
    args: Array.prototype.slice.call(arguments, 1)
  };
}
