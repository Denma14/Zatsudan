import NodeWebsocket, { WebSocketServer } from "ws";

import { ServerNetwork } from "./ServerNetwork.js";
import { add_message, get_messages } from "./queue.js";
import { events } from "../shared/events.js";
import * as Types from "../shared/types.js";

const serverNet = new ServerNetwork(8080);

serverNet.on(events.S_Init, (socket: any, id: string) => {
  serverNet.sendMessage(socket, events.S_Init, { messageLogs: get_messages() });
});

serverNet.on(
  events.C_Send_message,
  (socket: any, socketID: string, payload: Types.Message) => {
    console.log(payload);

    const C_new_message = add_message(payload.message, payload.id);

    if (!C_new_message) {
      console.error("Failed to add message.");
      return;
    }

    serverNet.broadcast(events.S_new_message, C_new_message);
  },
);

serverNet.init();
