export interface ClientSession {
  socket: WebSocket;
  username: string;
  timeoutId?: ReturnType<typeof setTimeout> | null;
}
