import WebSocket from "ws";
import { generateUuid } from "../utils";
import { Server } from "./server";
import baseClient from "../types/baseClient";

export default class Client extends baseClient {
    private connectionServer: Server;
    constructor(ws: WebSocket, connectionServer: Server) {
        super(ws);
        this.connectionServer = connectionServer;
    }

    send(action: string, data: any) {
        return new Promise<any>((resolve, reject) => {
            const id = generateUuid();
            this.sendRaw({ action, data, type: 1, id }, e => {
                if (e) reject(e);
            });

            this.connectionServer.onResponse(id, data => {
                resolve(data);
            });

            this.connectionServer.onError(id, reject);
        });
    }
}
