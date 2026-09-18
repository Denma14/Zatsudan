export let message_queue = [];
export function sum(a, b) {
    return a + b;
}
export function add_message(ID, message_string) {
    if (message_string) {
        if (!ID) {
            var message = { id: "xdx", message: message_string };
        }
        else {
            var message = { id: ID, message: message_string };
        }
        message_queue.push(message);
        if (message_queue.length > 10000) {
            message_queue.shift();
        }
        return message;
    }
}
export function get_messages() {
    return message_queue;
}
//# sourceMappingURL=queue.js.map