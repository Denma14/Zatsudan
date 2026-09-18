import NodeWebsocket, { WebSocketServer } from "ws";
import * as types from "./types/types.type.js";
export class ServerNetwork {
    wss;
    clientIds;
    listeners;
    constructor(port) {
        this.wss = new WebSocketServer({
            port: port,
        });
        this.clientIds = new Map();
        this.listeners = new Map();
    }
    init() {
        /* --
        Sets up the WebSocketServer (wss) for server-client communication
        -- */
        this.wss.on("connection", (socket) => {
            socket.on("error", console.error);
            //-- Clean up*/
            socket.on("close", (code, reason) => {
                socket.on("error", console.error);
                const token = socket.token;
                if (!token)
                    return;
                const session = this.clientIds.get(token);
                if (!session)
                    return;
                if (session.socket !== socket) {
                    console.log("guard to check so dead sockets dont activate deletion");
                    return;
                }
                console.log(code, reason);
                const timeoutId = setTimeout(() => {
                    this.clientIds.delete(token);
                    console.log("socket : ", session.username, "disconnected");
                    console.log(this.clientIds);
                }, 5000);
                session.timeoutId = timeoutId;
            });
            //-----------------------------------------------
            //-- listener setup
            socket.on("message", (data, isBinary) => {
                socket.on("error", console.error);
                const token = socket.token;
                const session = this.clientIds.get(token);
                if (session) {
                    var socketID = session.username;
                }
                else {
                    var socketID = "xdx";
                }
                const parsedData = JSON.parse(data);
                console.log(socketID, "sent ", parsedData);
                if (!parsedData) {
                    console.log("Invalid Data!");
                }
                const callback = this.listeners.get(parsedData["eventType"]);
                if (callback) {
                    callback(socket, socketID, parsedData["payload"]);
                }
            });
        });
    }
    sendMessage(socket, eventType, content) {
        socket.send(JSON.stringify({ eventType: eventType, payload: content }));
    }
    broadcast(eventType, content) {
        this.wss.clients.forEach(function each(client) {
            if (client.readyState === NodeWebsocket.OPEN) {
                console.log("firing clients");
                client.send(JSON.stringify({ eventType: eventType, payload: content }));
                return;
            }
            console.log("socket is not open");
        });
    }
    on(eventType, callback) {
        this.listeners.set(eventType, callback);
    }
    onConnect() { }
}
//# sourceMappingURL=ServerNetwork.class.js.map