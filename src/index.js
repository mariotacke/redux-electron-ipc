import { ipcRenderer as ipc } from 'electron';

export default function createIpc (events = {}) {
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
