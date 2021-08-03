export default class WsError {
    readonly message: string;
    readonly fatal: boolean;
    constructor(message: string, fatal?: boolean);
}
