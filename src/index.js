import { ipcRenderer as ipc } from 'electron';

function createIpc (events = {}, prefix = 'IPC_') {
    return ({ dispatch }) => {
        Object.keys(events).forEach((key) => {
            ipc.on(key, function () {
                dispatch(events[key](...arguments));
            });
        });

        return function (next) {
            return function (action) {
                if (action.channel && action.type.startsWith(prefix)) {
                    ipc.send(action.channel, ...(action.args || []));
                }

                return next(action);
            };
        };
    };
}

export default createIpc;
