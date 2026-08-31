import NodeWebsocket, { WebSocketServer } from "ws";
import { add_message, get_messages } from "./queue.js";
import { events } from "../shared/events.js";
import * as Types from "../shared/types.js";

export class ServerNetwork {
  wss;
  clientIds;
  listeners: Map<number, Function>;
  constructor(port: number) {
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
    this.wss.on("connection", (socket: any) => {
      socket.on("error", console.error);

      //-- Gives user ID for session

      const id = "Anon_" + Math.random().toString(36).substring(2, 10);
      console.log("client ID is : ", id);
      this.clientIds.set(socket, id);
      console.log("wss made");

      this.sendMessage(socket, events.S_Hand_ID, { id: id });

      //---------------------------------------------
      const initCallback = this.listeners.get(events.S_Init);

      if (initCallback) {
        initCallback(socket, id);
      }

      //this.sendMessage(socket, events.S_Init, { messageLogs: get_messages() });

      //-------------------------------------------

      //-- Clean up

      socket.on("close", (code: any, reason: any) => {
        console.log(code, reason);
        const id = this.clientIds.get(socket);
        console.log("socket : ", id, "disconnected");
        this.clientIds.delete(socket);
        console.log(this.clientIds);
      });

      //-----------------------------------------------

      //-- Message replication
      socket.on("message", (data: any, isBinary: any) => {
        const socketID = this.clientIds.get(socket);
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

  sendMessage(socket: any, eventType: number, message: any) {
    socket.send(JSON.stringify({ eventType: eventType, payload: message }));
  }

  broadcast(eventType: number, message: any) {
    this.wss.clients.forEach(function each(client: any) {
      if (client.readyState === NodeWebsocket.OPEN) {
        console.log("firing clients");
        client.send(JSON.stringify({ eventType: eventType, payload: message }));
        return;
      }
      console.log("socket is not open");
    });
  }

  on(eventType: number, callback: Function) {
    this.listeners.set(eventType, callback);
  }

  onConnect() {}
}
