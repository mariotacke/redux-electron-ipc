export function pingActionCreator (arg1, arg2, arg3) {
    return {
        type: 'IPC_PING',
        channel: 'ping',
        args: [
            arg1,
            arg2,
            arg3
        ]
    };
}

export function pongActionCreator (event, arg1, arg2, arg3) {
    return {
        type: 'IPC_PONG',
        arg1,
        arg2,
        arg3
    };
}
