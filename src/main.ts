import { sendMessageServer } from "./frontend/client.js";

const message_input = document.getElementById(
  "message-input",
) as HTMLInputElement | null;
const submit_message = document.getElementById(
  "submit-message",
) as HTMLInputElement | null;

import "./frontend/styles/style.css";

function sendMessage() {
  if (message_input) {
    const message: string = message_input.value.trim();

    if (message !== "") {
      sendMessageServer(message);

      message_input.value = "";
    }
  }
}

message_input?.addEventListener("keyup", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    sendMessage();
  }
});

submit_message?.addEventListener("click", (event: Event) => {
  sendMessage();
});
