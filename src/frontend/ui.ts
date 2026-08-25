const textDisplay = document.getElementById(
  "text-display",
) as HTMLBodyElement | null;

export type Message = {
  id: string;
  message: string;
};

export function makeMessageDiv(messageObject: Message) {
  if (textDisplay) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message-div";

    const id = document.createElement("h3");
    id.textContent = messageObject["id"];

    const message = document.createElement("h3");
    message.textContent = messageObject["message"];

    textDisplay.appendChild(messageDiv);
    messageDiv.appendChild(id);
    messageDiv.appendChild(message);
  }
}

function makeDivs(payload: Message[]) {
  if (textDisplay) {
    for (let i in payload) {
      if (payload[i]) {
        makeMessageDiv(payload[i]);
      }
    }
  }
}

export function xdx(payload: Message[]) {
  console.log(payload);

  makeDivs(payload);
}
