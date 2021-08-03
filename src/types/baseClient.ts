import { EventEmitter } from "events";
import WebSocket from "ws";

export default abstract class baseClient extends EventEmitter {
    readonly ws;

    constructor(ws: WebSocket) {
        super();

        this.ws = ws;

        this.ws.on("close", (...args) => this.emit("close", ...args));
        this.ws.on("error", (...args) => this.emit("error", ...args));
        this.ws.on("message", (...args) => this.emit("message", ...args));
        this.ws.on("open", (...args) => this.emit("open", ...args));
        this.ws.on("ping", (...args) => this.emit("ping", ...args));
        this.ws.on("pong", (...args) => this.emit("pong", ...args));
        this.ws.on("unexpected-response", (...args) => this.emit("unexpected-response", ...args));
        this.ws.on("upgrade", (...args) => this.emit("upgrade", ...args));
    }

    abstract send(action: string, data: any): Promise<any>;

    sendRaw(data: wsMessageData, cb?: (err?: Error) => void) {
        this.ws.send(JSON.stringify(data), cb);
    }

    error(message: string, fatal = false) {
        if (fatal) this.ws.close(3001, `Fatal error: ${message}`);
        else this.ws.send("Error: " + message);
    }

    on(event: "message" | "error" | "close" | "open" | "ping" | "pong" | "unexpected-response" | "upgrade", listener: (...args: any[]) => void): this {
        return super.on(event, listener);
    }
}
