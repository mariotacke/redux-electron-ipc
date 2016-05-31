export function exampleReducer (state = {}, action) {
    switch (action.type) {
        case 'IPC_PONG':
            console.log('Pong', action); // eslint-disable-line no-console
            return state;
        default:
            return state;
    }
}
