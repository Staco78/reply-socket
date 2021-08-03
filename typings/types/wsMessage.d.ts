import baseClient from "./baseClient";
export default class WsMessage<T = any, V = any> {
    readonly data: T;
    readonly action: string;
    readonly id: string;
    private client;
    constructor(data: wsMessageData<T>, client: baseClient);
    respond(data: V): void;
    error(message: string): void;
}
