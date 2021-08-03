/// <reference types="node" />
import { EventEmitter } from "events";
import baseClient from "../types/baseClient";
import WsMessage from "../types/wsMessage";
export declare class Client extends baseClient {
    private responseEventEmitter;
    private responseErrorEventEmitter;
    private actionEventEmitter;
    constructor(url: string);
    send(action: string, data: any): Promise<any>;
    private parseMessage;
    private parseResponse;
    onResponse(id: string, callback: (data: any) => void): void;
    onError(id: string, callback: (error: string) => void): void;
    onAction(action: string, callback: (client: Client, message: WsMessage<any>) => void): EventEmitter;
}
