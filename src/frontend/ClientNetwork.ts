import { events } from "../shared/events.js";
import * as Types from "../shared/types.js";
export class ClientNetwork {
  socket: WebSocket;
  client_id: string;
  listeners: Map<number, Function>;
  constructor(address: string) {
    this.socket = new WebSocket(address);
    this.client_id = "";
    this.listeners = new Map();
  }

  init() {
    /* --
    Sets up the WebSocket (ws) for server-client communication
    -- */
    this.socket.addEventListener("open", (event) => {
      console.log("ws connection established xdx");
    });

    this.socket.addEventListener("message", (event) => {
      console.log("got a message from server");
      const eventData = JSON.parse(event.data);
      console.log(eventData);
      console.log(eventData["eventType"]);

      if (!eventData) {
        console.error("Invalid EventData");
      }

      const callback = this.listeners.get(eventData["eventType"]);

      if (callback) {
        callback(eventData["payload"]);
      }
    });

    // Executes when the connection is closed, providing the close code and reason.
    this.socket.addEventListener("close", (event) => {
      console.log("WebSocket connection closed:", event.code, event.reason);
    });
    // Executes if an error occurs during the WebSocket communication.
    this.socket.addEventListener("error", (error) => {
      console.error("WebSocket error:", error);
    });

    this.on(events.S_Hand_ID, (payload: Types.idPayload) => {
      if (!payload.id) {
        console.error;
      }
      this.client_id = payload.id;
    });
  }

  sendMessge(message: string) {
    const C_message: Types.messageSignal = {
      eventType: events.C_Send_message,
      payload: { id: this.client_id, message: message },
    };
    this.socket.send(JSON.stringify(C_message));
  }

  on(eventType: number, callback: Function) {
    this.listeners.set(eventType, callback);
  }
}
