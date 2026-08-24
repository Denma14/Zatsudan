import { xdx } from "./frontend/client";

const message_input = document.getElementById(
  "message-input",
) as HTMLInputElement | null;
const submit_message = document.getElementById(
  "submit-message",
) as HTMLInputElement | null;

import "./frontend/styles/style.css";

message_input?.addEventListener("keyup", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    console.log("user has pressed enter");

    const text = message_input.value.trim();

    xdx(text);

    console.log(text);

    message_input.value = "";
  }
});

submit_message?.addEventListener("click", (event: Event) => {
  if (message_input) {
    const message: string = message_input.value.trim();

    if (message !== "") {
      xdx(message);

      message_input.value = "";
    }
  }
});
