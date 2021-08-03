import baseClient from "./baseClient";
import WsError from "./wsError";

export default class WsMessage<T = any, V = any> {
    readonly data: T;
    readonly action: string;
    readonly id: string;

    private client: baseClient;

    constructor(data: wsMessageData<T>, client: baseClient) {
        if (data.type !== 0) throw new WsError("Invalid json: wrong type");
        if (!data.action) throw new WsError("Invalid json: missing action");
        if (!data.data) throw new WsError("Invalid json: missing data");
        this.data = data.data;
        this.action = data.action;
        this.id = data.id;

        this.client = client;
    }

    respond(data: V) {
        this.client.sendRaw({ data, id: this.id, type: 1 });
    }

    error(message: string) {
        this.client.sendRaw({ data: {}, id: this.id, type: 1, error: message });
    }
}
