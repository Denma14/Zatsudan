import NodeWebsocket, { WebSocketServer } from "ws";
import { add_message, get_messages } from "./queue.js";

export type Message = {
  id: string;
  message: string;
};

const clientIds = new Map();

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
  const id = "Anon_" + Math.random().toString(36).substring(2, 10);
  console.log("client ID is : ", id);
  clientIds.set(socket, id);
  console.log("wss made");

  socket.send(JSON.stringify({ eventType: "S_hand_id", payload: id }));

  //-- Set ups the message logs
  const messageArray = {
    eventType: "init",
    payload: get_messages(),
  };
  socket.send(JSON.stringify(messageArray));

  //-------------------------------------------

  socket.on("message", (data: Buffer, isBinary: any) => {
    console.log("a client sent a message");
    const message = JSON.parse(data.toString("utf-8"));
    console.log("C_message is : ", message);

    if (message["eventType"] === "C_new_message") {
      const C_new_message = add_message(
        message["payload"]["message"],
        message["payload"]["id"],
      );
      console.log(C_new_message);

      if (!C_new_message) {
        console.error("Failed to add message.");
        return;
      }

      wss.clients.forEach(function each(client: any) {
        if (client.readyState === NodeWebsocket.OPEN) {
          console.log("firing clients");
          console.log(get_messages());
          console.log("sending :", {
            eventType: "S_new_message",
            payload: C_new_message,
          });
          client.send(
            JSON.stringify({
              eventType: "S_new_message",
              payload: C_new_message,
            }),
          );
        }
      });
    }
  });
});

/* Map out disconnection logic here */
wss.on("close", (socket: any) => {});
