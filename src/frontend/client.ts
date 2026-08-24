const ws = new WebSocket("ws://localhost:8080");

ws.addEventListener("open", (event) => {
  console.log("ws connection established xdx");

  ws.send("something");
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
