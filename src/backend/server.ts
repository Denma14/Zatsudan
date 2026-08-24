import WebSocket, { WebSocketServer } from "ws";
import { add_message, get_messages } from "./queue";

const wss = new WebSocketServer({
  port: 8080,
});

wss.on("connection", function connection(socket: any) {
  socket.on("error", console.error);
  /*socket.on("message", (rawData: any) => {
    const message = rawData.toString("utf-8");
    //const parsedData = JSON.parse(message);

    console.log(message);

    add_message();
  });*/
  console.log("socket is");
  console.log("wss made");

  socket.on("message", function message(data: any, isBinary: any) {
    console.log("a client sent a message");
    const message = data.toString("utf-8");

    add_message(message, "xdx");

    console.log(message);
    wss.clients.forEach(function each(client: any) {
      if (client.readyState === WebSocket.OPEN) {
        console.log("firing clients");
        client.send(JSON.stringify(get_messages()));
        console.log(get_messages());
        client.send("xdx server sent a message");
      }
    });
  });
});
