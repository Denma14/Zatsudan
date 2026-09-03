import NodeWebsocket, { WebSocketServer } from "ws";

import { ServerNetwork } from "./ServerNetwork.js";
import { add_message, get_messages } from "./queue.js";
import { events } from "../shared/events.js";
import * as types from "../shared/types.js";

import { saveMessage, getMessageLog } from "./db.js";

const serverNet = new ServerNetwork(8080);

/*serverNet.on(events.S_Init, (socket: any, id: string) => {
  serverNet.sendMessage(socket, events.S_Init, {
    messageLogs: getMessageLog(100),
  });
});*/

serverNet.on(
  events.C_Send_message,
  (socket: any, socketID: string, payload: types.Message) => {
    console.log(payload);

    const { id, message } = payload;

    const C_new_message = add_message(id, message);

    saveMessage(id, message);

    if (!C_new_message) {
      console.error("Failed to add message.");
      return;
    }

    serverNet.broadcast(events.S_new_message, C_new_message);
  },
);

serverNet.on(
  events.C_handshake,
  (socket: any, id: undefined, payload: types.idPayload) => {
    // -- Checks if your session hasn't ended and distributes ID
    const hasToken = serverNet.clientIds.has(payload.key);

    if (hasToken) {
      const existingSession = serverNet.clientIds.get(payload.key);
      if (existingSession.timeoutId) {
        console.log("there's a timeout id");
        clearTimeout(existingSession.timeoutId);
      }
      console.log("user Exists");
      serverNet.clientIds.set(payload.key, {
        socket: socket,
        id: existingSession.id,
        timeoutId: null,
      });
      (socket as any).token = payload.key;
      serverNet.sendMessage(socket, events.S_Hand_ID, {
        id: existingSession.id,
        key: existingSession.key,
      });
    } else {
      const token = crypto.randomUUID();
      const client_id = "Anon_" + Math.random().toString(36).substring(2, 10);
      console.log("client ID and UUID is : ", client_id, token);
      serverNet.clientIds.set(token, { socket: socket, id: client_id });
      console.log("wss made");

      (socket as any).token = token;

      serverNet.sendMessage(socket, events.S_Hand_ID, {
        id: client_id,
        key: token,
        timeoutId: null,
      });
    }

    // -- Loads message logs after handing id

    const messageLog = getMessageLog(100);
    serverNet.sendMessage(socket, events.S_Init, {
      messageLogs: messageLog,
    });
    console.log("message logs: ", messageLog);
  },
);

serverNet.init();
