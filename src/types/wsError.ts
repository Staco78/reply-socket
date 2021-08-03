export default class WsError {
    readonly message: string;
    readonly fatal: boolean;
    constructor(message: string, fatal = false) {
        this.message = message;
        this.fatal = fatal;
    }
}
