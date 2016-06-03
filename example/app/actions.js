export function pongActionCreator (event, arg1, arg2, arg3) {
    return {
        type: 'IPC_PONG',
        arg1,
        arg2,
        arg3
    };
}
