/// <reference types="node" />
import { EventEmitter } from "events";
import { IncomingMessage, ClientRequest } from "http";
import WebSocket from "ws";

export default abstract class baseClient extends EventEmitter {
    readonly ws: WebSocket;
    constructor(ws: WebSocket);
    abstract send(action: string, data: any): Promise<any>;
    sendRaw(data: wsMessageData, cb?: (err?: Error) => void): void;
    error(message: string, fatal?: boolean): void;

    on(event: "close", listener: (this: WebSocket, code: number, reason: string) => void): this;
    on(event: "error", listener: (this: WebSocket, err: Error) => void): this;
    on(event: "upgrade", listener: (this: WebSocket, request: IncomingMessage) => void): this;
    on(event: "message", listener: (this: WebSocket, data: WebSocket.Data) => void): this;
    on(event: "open", listener: (this: WebSocket) => void): this;
    on(event: "ping" | "pong", listener: (this: WebSocket, data: Buffer) => void): this;
    on(event: "unexpected-response", listener: (this: WebSocket, request: ClientRequest, response: IncomingMessage) => void): this;
    on(event: string | symbol, listener: (this: WebSocket, ...args: any[]) => void): this;

    once(event: "close", listener: (this: WebSocket, code: number, reason: string) => void): this;
    once(event: "error", listener: (this: WebSocket, err: Error) => void): this;
    once(event: "upgrade", listener: (this: WebSocket, request: IncomingMessage) => void): this;
    once(event: "message", listener: (this: WebSocket, data: WebSocket.Data) => void): this;
    once(event: "open", listener: (this: WebSocket) => void): this;
    once(event: "ping" | "pong", listener: (this: WebSocket, data: Buffer) => void): this;
    once(event: "unexpected-response", listener: (this: WebSocket, request: ClientRequest, response: IncomingMessage) => void): this;
    once(event: string | symbol, listener: (this: WebSocket, ...args: any[]) => void): this;

    off(event: "close", listener: (this: WebSocket, code: number, reason: string) => void): this;
    off(event: "error", listener: (this: WebSocket, err: Error) => void): this;
    off(event: "upgrade", listener: (this: WebSocket, request: IncomingMessage) => void): this;
    off(event: "message", listener: (this: WebSocket, data: WebSocket.Data) => void): this;
    off(event: "open", listener: (this: WebSocket) => void): this;
    off(event: "ping" | "pong", listener: (this: WebSocket, data: Buffer) => void): this;
    off(event: "unexpected-response", listener: (this: WebSocket, request: ClientRequest, response: IncomingMessage) => void): this;
    off(event: string | symbol, listener: (this: WebSocket, ...args: any[]) => void): this;

    addListener(event: "close", listener: (code: number, message: string) => void): this;
    addListener(event: "error", listener: (err: Error) => void): this;
    addListener(event: "upgrade", listener: (request: IncomingMessage) => void): this;
    addListener(event: "message", listener: (data: WebSocket.Data) => void): this;
    addListener(event: "open", listener: () => void): this;
    addListener(event: "ping" | "pong", listener: (data: Buffer) => void): this;
    addListener(event: "unexpected-response", listener: (request: ClientRequest, response: IncomingMessage) => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;

    removeListener(event: "close", listener: (code: number, message: string) => void): this;
    removeListener(event: "error", listener: (err: Error) => void): this;
    removeListener(event: "upgrade", listener: (request: IncomingMessage) => void): this;
    removeListener(event: "message", listener: (data: WebSocket.Data) => void): this;
    removeListener(event: "open", listener: () => void): this;
    removeListener(event: "ping" | "pong", listener: (data: Buffer) => void): this;
    removeListener(event: "unexpected-response", listener: (request: ClientRequest, response: IncomingMessage) => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
}
