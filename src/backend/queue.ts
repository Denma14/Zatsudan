export type Message = {
  id: string;
  message: string;
};

export let message_queue: Message[] = [];

export function sum(a: number, b: number) {
  return a + b;
}

export function add_message(message_string?: string, id?: string) {
  if (message_string) {
    const message: Message = { id: "xdx", message: message_string };

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
