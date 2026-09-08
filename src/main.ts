import { InitMessageLog, makeMessageDiv, deleteSpam } from "./frontend/ui.js";
import { ClientNetwork } from "./frontend/ClientNetwork.js";
import * as Types from "./shared/types.type.js";
import { events } from "./shared/events.js";

const net = new ClientNetwork("ws://192.168.1.208:8080");

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
      net.sendMessge(message);

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

//-- Listeners

net.on(events.S_Init, (payload: Types.initPayload) => {
  InitMessageLog(payload.messageLogs, net.client_id);
});

net.on(events.S_new_message, (payload: Types.S_messagePayload) => {
  makeMessageDiv(payload);
});

net.on(events.S_Hand_ID, (payload: Types.idPayload) => {
  if (!payload.username) {
    console.error;
  }
  net.client_id = payload.username;
  sessionStorage.setItem("id_key", payload.key);
});

net.on(events.S_delete_spam_message, (payload: any) => {
  if (payload.deletedMessageId) {
    deleteSpam(payload.deletedMessageId);
    console.log("deletedMessage is ", payload.deletedMessageId);
  }
});
//------------------------------------
net.init();
