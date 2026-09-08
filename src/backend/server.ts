import NodeWebsocket, { WebSocketServer } from "ws";

import { ServerNetwork } from "./ServerNetwork.class.js";
import { RateLimiter } from "./RateLimiter.class.js";

import { add_message, get_messages } from "./queue.js";
import { events } from "../shared/events.js";
import * as types_c from "../shared/types.type.js";
import * as types_s from "./types.type.js";

import { saveMessage, getMessageLog } from "./db.js";

const serverNet = new ServerNetwork(8080);

/*serverNet.on(events.S_Init, (socket: any, id: string) => {
  serverNet.sendMessage(socket, events.S_Init, {
    messageLogs: getMessageLog(100),
  });
});*/

serverNet.on(
  events.C_Send_message,
  (socket: any, socketID: string, payload: types_c.C_messagePayload) => {
    console.log(payload);
    console.log("client's token is ", socket.token);

    const session: types_s.ClientSession | undefined = serverNet.clientIds.get(
      socket.token,
    );

    if (!session) return;

    if (!payload.username) return;

    if (session.RateLimiter.allowMessage()) {
      const { username, content } = payload;

      const latestMessage = saveMessage(username, content);

      serverNet.broadcast(events.S_new_message, latestMessage);
      return;
    } else {
      console.log(session.username, "is rate limited");
      session.strikes++;
      serverNet.sendMessage(socket, events.S_message_limit_error, {
        error: `${session.strikes}/10 strikes left`,
      });

      if (session.strikes > 10) {
        console.log("client has exceeded limit disconnecting socket");
        socket.close();
      }
    }
  },
);

serverNet.on(
  events.C_handshake,
  (socket: any, username: undefined, payload: types_c.handshakePayload) => {
    // -- Checks if your session hasn't ended and distributes ID
    const existingSession = serverNet.clientIds.get(payload.key);

    if (existingSession) {
      if (existingSession.timeoutId) {
        console.log("there's a timeout id");
        clearTimeout(existingSession.timeoutId);
      }
      console.log("user Exists");
      serverNet.clientIds.set(payload.key, {
        socket: socket,
        username: existingSession.username,
        timeoutId: null,
        RateLimiter: new RateLimiter(),
        strikes: 0,
      });

      (socket as any).token = payload.key;

      serverNet.sendMessage(socket, events.S_Hand_ID, {
        username: existingSession.username,
        key: payload.key,
      });
    } else {
      // generates an id and token if there's no existing session key
      const token = crypto.randomUUID();
      const client_id = "Anon_" + Math.random().toString(36).substring(2, 10);
      console.log("client ID and UUID is : ", client_id, token);
      serverNet.clientIds.set(token, {
        socket: socket,
        username: client_id,
        timeoutId: null,
        RateLimiter: new RateLimiter(),
        strikes: 0,
      });
      console.log("wss made");

      (socket as any).token = token;

      serverNet.sendMessage(socket, events.S_Hand_ID, {
        username: client_id,
        key: token,
      });
    }

    // -- Loads message logs after handing id

    const messageLog = getMessageLog(100);
    serverNet.sendMessage(socket, events.S_Init, {
      messageLogs: messageLog,
    });
    //console.log("message logs: ", messageLog);
  },
);

serverNet.init();
