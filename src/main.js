import { InitMessageLog, makeMessageDiv, deleteSpam, displayError, } from "./frontend/ui.js";
import { ClientNetwork } from "./frontend/ClientNetwork.js";
import * as Types from "./shared/types.type.js";
import { events } from "./shared/events.js";
const net = new ClientNetwork("https://officials-resistant-formal-groove.trycloudflare.com");
const message_input = document.getElementById("message-input");
const submit_message = document.getElementById("submit-message");
import "./frontend/styles/style.css";
function sendMessage() {
    if (message_input) {
        const message = message_input.value.trim();
        if (message !== "") {
            if (message.length > 500) {
                displayError({ error: "Message exceeded character limit." });
                return;
            }
            net.sendMessge(message);
            message_input.value = "";
        }
    }
}
message_input?.addEventListener("keyup", (event) => {
    if (event.key === "Enter") {
        sendMessage();
    }
});
submit_message?.addEventListener("click", (event) => {
    sendMessage();
});
//-- Listeners
net.on(events.S_Init, (payload) => {
    InitMessageLog(payload.messageLogs, net.client_id);
});
net.on(events.S_new_message, (payload) => {
    makeMessageDiv(payload);
});
net.on(events.S_Hand_ID, (payload) => {
    if (!payload.username) {
        console.error;
    }
    net.client_id = payload.username;
    sessionStorage.setItem("id_key", payload.key);
});
net.on(events.S_delete_spam_message, (payload) => {
    console.log("deleting spam messages");
    if (payload.deletedMessageId) {
        deleteSpam(payload.deletedMessageId);
        console.log("deletedMessage is ", payload.deletedMessageId);
    }
});
net.on(events.S_message_limit_error, (payload) => {
    displayError(payload);
});
net.on(events.S_error, (payload) => {
    displayError(payload);
});
//------------------------------------
net.init();
//# sourceMappingURL=main.js.map