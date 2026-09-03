import { events } from "./events.js";

export type Message = {
  id: string;
  message: string;
};

//-- Signal Types --
export interface messageSignal {
  eventType: number;
  payload: { id: string; message: string };
}

export interface idSignal {
  eventType: 5;
  payload: { id: string };
}

export interface initSignal {
  eventType: 3;
  payload: { messageLogs: Message[] };
}
//---------------------------

// Payload Types --

export interface messagePayload {
  id: string;
  message: string;
}

export interface idPayload {
  id: string;
  key: string;
}

export interface initPayload {
  messageLogs: Message[];
}
//---------------------------
