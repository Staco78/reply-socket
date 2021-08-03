import WebSocket from "ws";
import { Server } from "./server";
import baseClient from "../types/baseClient";
export default class Client extends baseClient {
    private connectionServer;
    constructor(ws: WebSocket, connectionServer: Server);
    send(action: string, data: any): Promise<any>;
}
