import { RateLimiter } from "./RateLimiter.class.js";

export interface ClientSession {
  socket: WebSocket;
  username: string;
  timeoutId?: ReturnType<typeof setTimeout> | null;
  RateLimiter: RateLimiter;
  strikes: number;
}
