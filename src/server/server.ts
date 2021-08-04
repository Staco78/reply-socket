import WebSocket from "ws";
import { EventEmitter } from "events";
import WsError from "../types/wsError";
import Client from "./client";
import WsMessage from "../types/wsMessage";

export default class Server extends EventEmitter {
    readonly ws;

    private responseEventEmitter = new EventEmitter();
    private responseErrorEventEmitter = new EventEmitter();
    private actionEventEmitter = new EventEmitter();

    readonly clients: Client[] = [];

    constructor(port: number) {
        super();

        this.ws = new WebSocket.Server({ port });

        this.ws.on("close", (...args) => this.emit("close", ...args));
        this.ws.on("error", (...args) => this.emit("error", ...args));
        this.ws.on("headers", (...args) => this.emit("headers", ...args));
        this.ws.on("listening", (...args) => this.emit("listening", ...args));

        this.ws.on("connection", (wss, r) => {
            const client = new Client(wss, this);
            this.clients.push(client);

            this.emit("connection", client, r);

            wss.on("message", data => {
                try {
                    this.parseMessage(data, client);
                } catch (e) {
                    if (e instanceof WsError) client.error(e.message, e.fatal);
                    else client.error("Unkown server error: " + e.message ?? e, true);
                }
            });

            wss.on("close", () => {
                this.clients.splice(this.clients.indexOf(client));
            });
        });
    }

    private parseMessage(data: WebSocket.Data, client: Client) {
        let json: wsMessageData;

        try {
            json = JSON.parse(data.toString());
        } catch (error) {
            throw new WsError("Invalid json");
        }

        if (!json.id) throw new WsError("Invalid json: missing id");

        if (json.type === undefined) throw new WsError("Invalid json: missing type");
        if (json.type !== 0 && json.type !== 1) throw new WsError("Invalid json: unkown type");

        if (!json.data) throw new WsError("Invalid json: missing data");

        if (json.type === 0) {
            if (!json.action) throw new WsError("Invalid json: missing action");
            if (typeof json.action !== "string") throw new WsError("Invalid json");

            this.actionEventEmitter.emit(json.action, client, new WsMessage(json, client));
        } else this.parseResponse(json);
    }

    private parseResponse(json: wsMessageData) {
        if (json.error) this.responseErrorEventEmitter.emit(json.id, json.error);
        else this.responseEventEmitter.emit(json.id, json.data);
    }

    // on(event: string, callback: (...args: any[]) => void): this {
    //     return super.on(event, callback);
    // }

    onResponse(id: string, callback: (data: any) => void) {
        this.responseEventEmitter.on(id, callback);
    }

    onError(id: string, callback: (error: string) => void) {
        this.responseErrorEventEmitter.on(id, callback);
    }

    onAction(action: string, callback: (client: Client, message: WsMessage<any>) => void) {
        return this.actionEventEmitter.on(action, function (client: Client, message: WsMessage) {
            try {
                callback(client, message);
            } catch (e) {
                if (e instanceof WsError) {
                    if (e.fatal) client.error(e.message, true);
                    else message.error(e.message);
                } else client.error(`Unkown server error: ${e.message ?? e}`, true);
            }
        });
    }
}
