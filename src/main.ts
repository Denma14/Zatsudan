const message_input = document.getElementById(
  "message-input",
) as HTMLInputElement | null;

import "./styles/style.css";

message_input?.addEventListener("keyup", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    console.log("user has pressed enter");

    const text = message_input.value.trim();

    console.log(text);
  }
});
