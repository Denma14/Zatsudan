import * as types from "../shared/types.type.js";

const textDisplay = document.getElementById(
  "text-display",
) as HTMLBodyElement | null;

const message_input = document.getElementById(
  "message-input",
) as HTMLInputElement | null;

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

export function makeMessageDiv(messageObject: types.S_messagePayload) {
  console.log(messageObject);
  if (textDisplay) {
    console.log("making message");
    const messageDiv = document.createElement("div");
    messageDiv.className = "message-div";
    messageDiv.id = String(messageObject.id);

    const username = document.createElement("h3");
    username.textContent = messageObject["username"] + " :";
    username.className = "username-text";
    username.style.color = stringToHSL(messageObject["username"]);
    username.style.textDecoration = "underline";

    const message = document.createElement("h3");
    message.textContent = messageObject["content"];
    message.className = "message-text";

    const maxScrollableDist =
      textDisplay.scrollHeight - textDisplay.clientHeight;
    const shouldAutoScroll = textDisplay.scrollTop >= maxScrollableDist - 10;

    textDisplay.appendChild(messageDiv);
    messageDiv.appendChild(username);
    messageDiv.appendChild(message);

    if (shouldAutoScroll) {
      textDisplay.scrollTop = textDisplay.scrollHeight;
    }

    return;
  }
  console.log("textDisplay doesnt exist!");
}

export function deleteMessageDiv(messageObject: any) {
  if (textDisplay) {
    console.log("deleting message id: ", messageObject);
    const messageDiv = document.getElementById(
      String(messageObject),
    ) as HTMLBodyElement;

    if (messageDiv) {
      messageDiv.remove();
    }
  }
}

export function deleteSpam(messageObject: any) {
  if (textDisplay) {
    for (let i in messageObject) {
      deleteMessageDiv(messageObject[i]);
    }
  }
}

function makeDivs(payload: types.S_messagePayload[]) {
  if (textDisplay) {
    for (let i in payload) {
      if (payload[i]) {
        makeMessageDiv(payload[i]);
      }
    }
  }
}

export function InitMessageLog(
  payload: types.S_messagePayload[],
  clientID: string,
) {
  console.log(payload);

  makeDivs(payload);

  console.log("client id is", clientID);

  if (message_input) {
    message_input.placeholder = `${clientID} type a message!`;
  }

  if (textDisplay) {
    textDisplay.scrollTop = textDisplay.scrollHeight;
  }
}
