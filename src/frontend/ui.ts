const textDisplay = document.getElementById(
  "text-display",
) as HTMLBodyElement | null;

export type Message = {
  id: string;
  message: string;
};

function makeDivs(payload: Message[]) {
  if (textDisplay) {
    for (let i in payload) {
      console.log("message is :", i);
      const messageDiv = document.createElement("div");
      messageDiv.className = "message-div";

      const id = document.createElement("h3");
      id.textContent = payload[i]["id"];

      const message = document.createElement("h3");
      message.textContent = payload[i]["message"];

      textDisplay.appendChild(messageDiv);
      messageDiv.appendChild(id);
      messageDiv.appendChild(message);
    }
  }
}

export function xdx(payload: Message[]) {
  console.log(payload);

  makeDivs(payload);
}
