import { URL } from '@type/value';
import { SocketData, AnswerError, PayloadUserLogin, PayloadMessanger } from '@app/types/type';
import { TypeSocket } from '@type/enums';
import { DisconnectEl } from '@components/disconnect/Disconnect';
import { Payload } from '@type/type';
import { MessengerWindow } from '@components/messenger/messenger-window/MessengerWindow';

export class Socket {
  public static socket: WebSocket;

  private static reLogin: () => Promise<void>;

  private static _messengerWindow: MessengerWindow;

  public static async createSocet() {
    try {
      Socket.socket = new WebSocket(URL);

      const socketPromise: Promise<WebSocket> = new Promise((resolve, reject) => {
        Socket.socket.onopen = () => resolve(Socket.socket);
        Socket.socket.onerror = (error) => reject(error);
      });

      await socketPromise;

      Socket.socket.onclose = async () => {
        await Socket.reconnection();

        this.reLogin();
      };

      Socket.socket.onerror = async (error) => {
        console.error('WebSocket error:', error);
        await Socket.reconnection();
      };
    } catch {
      await Socket.reconnection();
    }
  }

  public static setMessenger(messengerWindow: MessengerWindow) {
    this._messengerWindow = messengerWindow;
  }

  public static setEnter(enter: () => Promise<void>) {
    this.reLogin = enter;
  }

  private static async reconnection() {
    DisconnectEl.getContainer().show();
    let connected = false;
    while (!connected) {
      try {
        await this.createSocet();
        connected = true;
        DisconnectEl.getContainer().close();
      } catch (error) {
        console.log('Failed to restore');
      }
    }
  }

  public static async sendRequest<T>(request: SocketData<Payload>): Promise<SocketData<T> | AnswerError> {
    try {
      Socket.socket.send(JSON.stringify(request));

      return new Promise((resolve, reject) => {
        Socket.socket.onmessage = (event) => {
          const response: SocketData<Payload> = JSON.parse(event.data);
          let user: SocketData<PayloadUserLogin>;
          switch (response.type) {
            case TypeSocket.USER_EXTERNAL_LOGIN:
              user = response as SocketData<PayloadUserLogin>;
              this._messengerWindow.loginOtherUser(user.payload.user);
              break;
            case TypeSocket.USER_EXTERNAL_LOGOUT:
              user = response as SocketData<PayloadUserLogin>;
              this._messengerWindow.loginOtherUser(user.payload.user);
              break;
            case TypeSocket.MSG_FROM_USER:
              if (!response.payload) return;

              this._messengerWindow.drawMessages(response.payload as PayloadMessanger);
              break;
            case TypeSocket.MSG_SEND:
              console.log(23423);
              this._messengerWindow.chooseUser();
              break;
            default:
              break;
          }
          const responseReturn: SocketData<T> = JSON.parse(event.data);
          if (request.id === responseReturn.id) resolve(responseReturn);
        };
        Socket.socket.onerror = (error) => reject(error);
      });
    } catch (error) {
      return {
        id: '0',
        type: TypeSocket.ERROR,
        payload: {
          error: `error`,
        },
      };
    }
  }
}
