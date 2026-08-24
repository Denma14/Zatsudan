import Websocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({
  port: 8080,
});

wss.on("connection", (socket: any) => {
  socket.on("message", (rawData: any) => {
    console.log("raw data is" + rawData);
  });

  console.log("wss made");
});
