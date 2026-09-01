const textDisplay = document.getElementById(
  "text-display",
) as HTMLBodyElement | null;

export type Message = {
  id: string;
  message: string;
};

function stringToHSL(str: string, saturation = 70, lightness = 35): string {
  let hash = 0;

  for (let i = 0; i < str.length; i++) {
    const charCode = str.charCodeAt(i);

    hash = (hash << 5) - hash + charCode;
    hash |= 0;
  }

  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
}

export function makeMessageDiv(messageObject: Message) {
  if (textDisplay) {
    console.log("making message");
    const messageDiv = document.createElement("div");
    messageDiv.className = "message-div";

    const id = document.createElement("h3");
    id.textContent = messageObject["id"] + ":";
    id.className = "id-text";
    id.style.color = stringToHSL(messageObject["id"]);
    id.style.textDecoration = "underline";

    const message = document.createElement("h3");
    message.textContent = messageObject["message"];
    message.className = "message-text";

    textDisplay.appendChild(messageDiv);
    messageDiv.appendChild(id);
    messageDiv.appendChild(message);

    textDisplay.scrollTop = textDisplay.scrollHeight;
    return;
  }
  console.log("textDisplay doesnt exist!");
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

export function InitMessageLog(payload: Message[]) {
  console.log(payload);

  makeDivs(payload);
}
