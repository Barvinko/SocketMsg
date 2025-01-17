import { TypeSocket } from '@type/enums';

export type User = {
  login: string;
  password: string;
};

export type UserLogin = {
  login: string;
  isLogined: boolean;
};

export type Messenge = {
  id: string;
  from: string;
  to: string;
  text: string;
  datetime: number;
  status: {
    isDelivered: boolean;
    isReaded: boolean;
    isEdited: boolean;
  };
};

export type TypeSocketData = User | UserLogin;

export type PayloadUserLogin = { user: UserLogin };

export type PayloadUser = { user: User };

export type PayloadUsers = { users: UserLogin[] };

export type PayloadHistoryRequest = { user: { login: string } };

export type PayloadMessanger = { messages: Messenge[] };

export type Payload = null | PayloadUser | PayloadUsers | PayloadUserLogin | PayloadMessanger;

export type AnswerError = {
  id: string;
  type: TypeSocket.ERROR;
  payload: {
    error: string;
  };
};

export type SocketData<T> = {
  id: string | null;
  type: TypeSocket;
  payload: T;
};

export type Messenges = {
  id: string;
  type: TypeSocket.MSG_FROM_USER;
  payload: {
    messages: Messenge[];
  };
};

export type SendMessenge = {
  id: string;
  type: TypeSocket.MSG_SEND;
  payload: {
    message: {
      to: string;
      text: string;
    };
  };
};

export type UserList = {
  input: HTMLInputElement;
  list: HTMLDivElement;
};

export type TitleElement = {
  name: HTMLSpanElement;
  online: HTMLSpanElement;
};
export type SendInput = {
  input: HTMLInputElement;
  send: HTMLButtonElement;
};

export type DataNewMessage = {
  classSender: string;
  datetime: number;
  senderName: string;
  text: string;
  status: string;
};
