import { xdx } from "./ui.js";

const ws = new WebSocket("ws://192.168.1.208:8080");

ws.addEventListener("open", (event) => {
  console.log("ws connection established xdx");
});

ws.addEventListener("message", (event) => {
  console.log("got a message from server");
  const eventData = JSON.parse(event.data);
  console.log(eventData);
  console.log(eventData["eventType"]);
  if (eventData["eventType"] === "init") {
    xdx(eventData["payload"]);
  }
});
// Executes when the connection is closed, providing the close code and reason.
ws.addEventListener("close", (event) => {
  console.log("WebSocket connection closed:", event.code, event.reason);
});
// Executes if an error occurs during the WebSocket communication.
ws.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});

export function sendMessageServer(payload?: any) {
  if (payload) {
    ws.send(payload);
  } else {
    ws.send("sent a message");
  }
}
