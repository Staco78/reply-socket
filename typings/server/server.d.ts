/// <reference types="node" />
import WebSocket from "ws";
import { EventEmitter } from "events";
import Client from "./client";
import WsMessage from "../types/wsMessage";

import { IncomingMessage } from "http";

declare class Server extends EventEmitter {
    readonly ws: WebSocket.Server;
    private responseEventEmitter;
    private responseErrorEventEmitter;
    private actionEventEmitter;
    readonly clients: Client[];
    constructor(port: number);
    private parseMessage;
    private parseResponse;
    onResponse(id: string, callback: (data: any) => void): void;
    onError(id: string, callback: (error: string) => void): void;
    onAction(action: string, callback: (client: Client, message: WsMessage<any>) => void): EventEmitter;

    on(event: "connection", cb: (this: Server, client: Client, request: IncomingMessage) => void): this;
    on(event: "error", cb: (this: Server, error: Error) => void): this;
    on(event: "headers", cb: (this: Server, headers: string[], request: IncomingMessage) => void): this;
    on(event: "close" | "listening", cb: (this: Server) => void): this;
    on(event: string | symbol, listener: (this: Server, ...args: any[]) => void): this;

    once(event: "connection", cb: (this: Server, client: Client, request: IncomingMessage) => void): this;
    once(event: "error", cb: (this: Server, error: Error) => void): this;
    once(event: "headers", cb: (this: Server, headers: string[], request: IncomingMessage) => void): this;
    once(event: "close" | "listening", cb: (this: Server) => void): this;
    once(event: string | symbol, listener: (...args: any[]) => void): this;

    off(event: "connection", cb: (this: Server, client: Client, request: IncomingMessage) => void): this;
    off(event: "error", cb: (this: Server, error: Error) => void): this;
    off(event: "headers", cb: (this: Server, headers: string[], request: IncomingMessage) => void): this;
    off(event: "close" | "listening", cb: (this: Server) => void): this;
    off(event: string | symbol, listener: (this: Server, ...args: any[]) => void): this;

    addListener(event: "connection", cb: (client: Client, request: IncomingMessage) => void): this;
    addListener(event: "error", cb: (err: Error) => void): this;
    addListener(event: "headers", cb: (headers: string[], request: IncomingMessage) => void): this;
    addListener(event: "close" | "listening", cb: () => void): this;
    addListener(event: string | symbol, listener: (...args: any[]) => void): this;

    removeListener(event: "connection", cb: (client: Client) => void): this;
    removeListener(event: "error", cb: (err: Error) => void): this;
    removeListener(event: "headers", cb: (headers: string[], request: IncomingMessage) => void): this;
    removeListener(event: "close" | "listening", cb: () => void): this;
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
}


export default Server;