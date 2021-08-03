import { EventEmitter } from "events";
import WebSocket from "ws";
import baseClient from "../types/baseClient";
import WsError from "../types/wsError";
import WsMessage from "../types/wsMessage";
import { generateUuid } from "../utils";

export class Client extends baseClient {
    private responseEventEmitter = new EventEmitter();
    private responseErrorEventEmitter = new EventEmitter();
    private actionEventEmitter = new EventEmitter();

    constructor(url: string) {
        super(new WebSocket(url));

        this.on("message", data => {
            try {
                this.parseMessage(data);
            } catch (e) {
                if (e instanceof WsError) this.error(e.message, e.fatal);
                else this.error("Unkown server error", true);
            }
        });
    }

    send(action: string, data: any) {
        return new Promise<any>((resolve, reject) => {
            if (this.ws.readyState !== WebSocket.OPEN) this.ws.on("open", () => this.send(action, data).then(resolve).catch(reject));
            else {
                const id = generateUuid();
                this.sendRaw({ action, data, type: 0, id }, e => {
                    if (e) reject(e);
                });

                this.onResponse(id, data => {
                    resolve(data);
                });

                this.onError(id, reject);
            }
        });
    }

    private parseMessage(data: WebSocket.Data) {
        let json: wsMessageData;

        try {
            json = JSON.parse(data.toString());
        } catch (error) {
            throw new WsError("Invalid json");
        }

        if (json.type === undefined) throw new WsError("Invalid json: missing type");
        if (json.type !== 0 && json.type !== 1) throw new WsError("Invalid json: unkown type");

        if (!json.data) throw new WsError("Invalid json: missing data");
        if (typeof json.data !== "object") throw new WsError("Invalid json");

        if (json.type === 0) {
            if (!json.action) throw new WsError("Invalid json: missing action");
            if (typeof json.action !== "string") throw new WsError("Invalid json");

            console.log(json.action);

            if (!json.id) throw new WsError("Invalid json: missing id");

            this.actionEventEmitter.emit(json.action, new WsMessage<this>(json, this));
        } else this.parseResponse(json);
    }

    private parseResponse(json: wsMessageData) {
        if (!json.id || typeof json.id !== "string") throw new WsError("Invalid json: missing id");

        if (json.error) this.responseErrorEventEmitter.emit(json.id, json.error);
        else this.responseEventEmitter.emit(json.id, json.data);
    }

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
                } else client.error("Unkown server error", true);
            }
        });
    }
}
