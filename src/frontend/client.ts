const ws = new WebSocket("ws://192.168.1.208:8080");

ws.addEventListener("open", (event) => {
  console.log("ws connection established xdx");

  ws.send("connection established????");
});

ws.addEventListener("message", (event) => {
  console.log("Message from server: ", event.data);
});
// Executes when the connection is closed, providing the close code and reason.
ws.addEventListener("close", (event) => {
  console.log("WebSocket connection closed:", event.code, event.reason);
});
// Executes if an error occurs during the WebSocket communication.
ws.addEventListener("error", (error) => {
  console.error("WebSocket error:", error);
});

export function xdx(payload?: any) {
  if (payload) {
    ws.send(payload);
  } else {
    ws.send("sent a message");
  }
}
