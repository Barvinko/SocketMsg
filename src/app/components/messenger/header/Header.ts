import { Component } from '@components/Component/Component';
import { createElement, createSpans, createButton } from '@utils/createElement';
import { Spans, TypeSocket } from '@type/enums';
import { UserStorage } from '@utils/LocalStorage';
import { SocketData, PayloadUser } from '@type/type';
import { generateId } from '@utils/generateId';
import { AboutEl } from '@components/about/About';
import { Socket } from '@utils/Socket';

export class Header extends Component {
  private _userName!: HTMLSpanElement;

  constructor() {
    super('header', 'header');
    this.createheader();
  }

  private createheader() {
    const containerNames = createElement('div', 'header__names');
    this._userName = createSpans('header__userName', `User: `, containerNames);
    createSpans('header__userApp', `Fun Chat`, containerNames, Spans.H3);

    const oldContainerNames = this._container.querySelector('header__names');

    const headerButtons = this.createButtons();
    containerNames.appendChild(headerButtons);

    if (oldContainerNames) {
      this._container.replaceChild(containerNames, oldContainerNames);
      return;
    }
    this._container.appendChild(containerNames);
  }

  public setName() {
    const name: string | undefined = UserStorage.getData()?.login;
    this._userName.innerText = `User: ${name}`;
  }

  private createButtons(): HTMLDivElement {
    const headerButtons = createElement('div', 'header_buttons') as HTMLDivElement;

    const aboutButton = createButton('button header__auto', 'About', headerButtons);
    aboutButton.addEventListener('click', () => {
      AboutEl.getContainer().show();
    });

    const exitButton = createButton('button header__exit', 'Exit', headerButtons);
    exitButton.addEventListener('click', () => this.exit());

    return headerButtons;
  }

  private async exit() {
    const userLocal = UserStorage.getData();
    if (!userLocal) return;

    const userExit: SocketData<PayloadUser> = {
      id: generateId(),
      type: TypeSocket.USER_LOGOUT,
      payload: {
        user: {
          login: userLocal.login,
          password: userLocal.password,
        },
      },
    };
    await Socket.sendRequest(userExit);

    UserStorage.deleteData();
  }
}
