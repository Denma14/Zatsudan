import NodeWebsocket, { WebSocketServer } from "ws";
import type {
  ClientOptions,
  RawData,
  WebSocketEventMap,
  Event,
  ErrorEvent,
  CloseEvent,
  MessageEvent,
  EventListenerOptions,
} from "ws";
import { add_message, get_messages } from "./queue.js";

const wss = new WebSocketServer({
  port: 8080,
});
/* HELPER FUNCTIONS  */

/* HANDLES THE WSS CONNECTION */

wss.on("connection", function connection(socket: any) {
  socket.on("error", console.error);
  /*socket.on("message", (rawData: any) => {
    const message = rawData.toString("utf-8");
    //const parsedData = JSON.parse(message);

    console.log(message);

    add_message();
  });*/
  console.log("wss made");

  //-- Set ups the message logs
  const messageArray = {
    eventType: "init",
    payload: get_messages(),
  };
  socket.send(JSON.stringify(messageArray));

  //-------------------------------------------

  socket.on("message", function message(data: Buffer, isBinary: any) {
    console.log("a client sent a message");
    const message = data.toString("utf-8");

    add_message(message, "xdx");

    console.log(message);
    wss.clients.forEach(function each(client: any) {
      if (client.readyState === NodeWebsocket.OPEN) {
        console.log("firing clients");
        console.log(get_messages());
        client.send("xdx server sent a message");
      }
    });
  });
});
