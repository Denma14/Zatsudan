import { events } from "./events.js";

// Payload Types --

export interface C_messagePayload {
  username: string;
  content: string;
}

export interface S_messagePayload {
  id: number;
  username: string;
  content: string;
  created_at: string;
}

export interface idPayload {
  username: string;
  key: string;
}

export interface handshakePayload {
  key: string;
}

export interface initPayload {
  messageLogs: S_messagePayload[];
}

export interface limitErrorPayload {
  error: string;
}
//---------------------------

//-- Signal Types --
export interface C_messageSignal {
  eventType: number;
  payload: C_messagePayload;
}

export interface S_messageSignal {
  eventType: number;
  payload: S_messagePayload;
}

export interface idSignal {
  eventType: number;
  payload: idPayload;
}

export interface initSignal {
  eventType: number;
  payload: initPayload;
}

export interface rateLimitErrorSignal {
  eventType: number;
  payload: limitErrorPayload;
}
//---------------------------
