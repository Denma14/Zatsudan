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
  eventType: 5;
  payload: idPayload;
}

export interface initSignal {
  eventType: 3;
  payload: initPayload;
}
//---------------------------
