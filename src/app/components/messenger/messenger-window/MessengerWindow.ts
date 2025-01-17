import { Component } from '@components/Component/Component';
import { createElement, createInput, createDiv, createSpans, createButton } from '@utils/createElement';
import { Socket } from '@utils/Socket';
import { Spans, TypeSocket } from '@type/enums';
import {
  SocketData,
  PayloadUsers,
  UserLogin,
  UserList,
  TitleElement,
  SendInput,
  SendMessenge,
  PayloadHistoryRequest,
  PayloadMessanger,
  DataNewMessage,
} from '@type/type';
import { generateId } from '@utils/generateId';
import { UserStorage } from '@app/utils/LocalStorage';

export class MessengerWindow extends Component {
  private _userList: UserList;

  private _users: UserLogin[];

  private _title!: TitleElement;

  private _sendInput!: SendInput;

  private _messagesContainer!: HTMLDivElement;

  private _optionsTime: Intl.DateTimeFormatOptions;

  constructor() {
    super('main', 'messenger-window');
    this._users = [];
    this._userList = this.createList();
    this.createDialog();

    this._optionsTime = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    };

    document.addEventListener('keypress', (event) => {
      if (event.key === 'Enter' && !this._sendInput.send.disabled) {
        this._sendInput.send.click();
      }
    });
  }

  private createList(): UserList {
    const containerList = createElement('section', 'user-list messenger-window__section', this._container);
    const input = createInput('user-list__search', 'text', containerList);
    input.placeholder = 'Search...';
    const list = createDiv('user-list__list', containerList);

    input.addEventListener('input', () => {
      const filteredItems = this._users.filter((user) => {
        const name = user.login;
        const needName = this._userList.input.value.toLowerCase();
        return name.toLowerCase().includes(needName);
      });
      filteredItems.sort((a, b) => {
        if (a.isLogined === b.isLogined) return 0;
        return a.isLogined ? -1 : 1;
      });
      this.createUsers(filteredItems);
    });

    list.addEventListener('click', (event) => this.chooseUser(event.target as Element));

    return { input, list };
  }

  public chooseUser(event: Element = this._title.name) {
    let eventEl = event as HTMLDivElement;
    if (event !== this._title.name) {
      eventEl = event.closest('.user-list__user') as HTMLDivElement;
      if (!eventEl) {
        return;
      }
    }
    console.log(eventEl);
    const currentUser = this._users.find((user) => user.login === eventEl.innerText);
    if (!currentUser) return;
    this._title.name.innerText = currentUser.login;

    switch (currentUser.isLogined) {
      case true:
        this._title.online.innerText = 'online';
        break;

      case false:
        this._title.online.innerText = 'not online';
        break;

      default:
        break;
    }

    const historyRequest: SocketData<PayloadHistoryRequest> = {
      id: generateId(),
      type: TypeSocket.MSG_FROM_USER,
      payload: {
        user: {
          login: currentUser.login,
        },
      },
    };

    Socket.socket.send(JSON.stringify(historyRequest));

    this._sendInput.input.disabled = false;
  }

  public drawMessages({ messages }: PayloadMessanger) {
    this._messagesContainer.innerHTML = '';
    const startMessage = this._container.querySelector('.dialog-user__start-message') as HTMLSpanElement;
    if (startMessage) startMessage.innerText = messages[0] ? '' : 'Write your first message...';

    const messagesReverse = messages.reverse();
    messagesReverse.forEach((message) => {
      let status: string = '';
      let senderName = message.from;
      let classSender = 'sender';
      if (senderName !== this._title.name.innerText) {
        senderName = 'You';
        classSender = 'you';
        if (message.status.isEdited) {
          status = 'edited';
        } else if (message.status.isReaded) {
          status = 'readed';
        } else if (message.status.isDelivered) {
          status = 'delivered';
        }
      }

      this.createMessage({
        classSender,
        datetime: message.datetime,
        senderName,
        text: message.text,
        status,
      });
    });
  }

  public createMessage({ classSender, datetime, senderName, text, status }: DataNewMessage) {
    const containerMessage = createDiv(
      `dialog-user__message-container dialog-user__message-container_${classSender}`,
      this._messagesContainer,
    );
    const date = new Date(datetime);
    const formattedDate = date.toLocaleString('ru-RU', this._optionsTime);

    createSpans('dialog-user__message-data', `${senderName} ${formattedDate}`, containerMessage);
    createSpans('dialog-user__message', text, containerMessage);
    createSpans('dialog-user__status', status, containerMessage);
  }

  public async drawList() {
    const requestActive: SocketData<null> = {
      id: generateId(),
      type: TypeSocket.USER_ACTIVE,
      payload: null,
    };
    const requestInactive: SocketData<null> = {
      id: generateId(),
      type: TypeSocket.USER_INACTIVE,
      payload: null,
    };

    const responseActive = await Socket.sendRequest<PayloadUsers>(requestActive);
    const responseInactive = await Socket.sendRequest<PayloadUsers>(requestInactive);
    if (responseActive.type === TypeSocket.ERROR || responseInactive.type === TypeSocket.ERROR) {
      console.error('data no come');
      return;
    }
    const userActive = responseActive.payload as PayloadUsers;
    const userInactive = responseInactive.payload as PayloadUsers;
    this._users = [...userActive.users, ...userInactive.users];
    this.createUsers(this._users);
  }

  public createUsers(users: UserLogin[]) {
    function createUser(user: UserLogin): HTMLDivElement {
      const container = createDiv('user-list__user');
      const userActiveClass = user.isLogined ? 'user-list__name-active' : '';
      createSpans(`user-list__name ${userActiveClass}`, user.login, container);
      return container;
    }

    this._userList.list.innerHTML = '';

    users.forEach((user) => {
      if (user.login === UserStorage.getData()?.login || user.login === '') return;
      this._userList.list.appendChild(createUser(user));
    });
  }

  private createDialog() {
    const containerDialog = createElement('section', 'dialog-user messenger-window__section', this._container);
    const containerTitle = createDiv('dialog-user__title', containerDialog);
    this._title = {
      name: createSpans('dialog-user__name', '', containerTitle, Spans.SPAN),
      online: createSpans('dialog-user__online', '', containerTitle, Spans.SPAN),
    };

    this._messagesContainer = createDiv('dialog-user__messages', containerDialog);
    createSpans('dialog-user__start-message', 'Select a recipient...', containerDialog, Spans.SPAN);

    const conteinerInput = createDiv('dialog-user__container-enter', containerDialog);
    const input = createInput('dialog-user__messege-input', 'text', conteinerInput);
    input.placeholder = 'Message...';
    input.disabled = true;
    const buttonSend = createButton('button dialog-user__submit', 'Send', conteinerInput);
    buttonSend.disabled = true;

    this._sendInput = {
      input,
      send: buttonSend,
    };

    input.addEventListener('input', () => {
      buttonSend.disabled = input.value.trim() === '';
    });

    buttonSend.addEventListener('click', () => this.sendMessenge());
  }

  private sendMessenge() {
    const message: SendMessenge = {
      id: generateId(),
      type: TypeSocket.MSG_SEND,
      payload: {
        message: {
          to: this._title.name.innerText,
          text: this._sendInput.input.value,
        },
      },
    };

    Socket.socket.send(JSON.stringify(message));
    this._sendInput.input.value = '';
    this._sendInput.send.disabled = true;
  }

  public loginOtherUser(user: UserLogin) {
    const userHave = this._users.some((userEl) => {
      const answer = userEl.login === user.login;
      if (answer) {
        userEl.isLogined = !userEl.isLogined;
      }
      return answer;
    });

    if (!userHave) this._users.unshift(user);
    const event = new Event('input', {
      bubbles: true,
      cancelable: true,
    });

    this._userList.input.dispatchEvent(event);
  }
}
