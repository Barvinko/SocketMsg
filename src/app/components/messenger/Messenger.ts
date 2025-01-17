import { Component } from '@components/Component/Component';
import { Header } from '@components/messenger/header/Header';
import { Footer } from '@components/messenger/footer/Footer';
import { MessengerWindow } from '@components/messenger/messenger-window/MessengerWindow';
import { createDiv } from '@app/utils/createElement';
import { Socket } from '@app/utils/Socket';

export class Messenger extends Component {
  private _header: Header;

  private _footer: Footer;

  private _messengerWindow!: MessengerWindow;

  constructor() {
    super('article', 'article container messenger');
    this._header = new Header();
    this._footer = new Footer();
    this._container.appendChild(this._header.getContainer());
    createDiv('messenger-window', this._container);
    this._container.appendChild(this._footer.getContainer());
  }

  public setHeaderName() {
    this._header.setName();
    this._messengerWindow = new MessengerWindow();
    Socket.setMessenger(this._messengerWindow);
    const oldMessenger = this._container.querySelector('.messenger-window');
    if (!oldMessenger) return;

    this._container.replaceChild(this._messengerWindow.getContainer(), oldMessenger);
    this._messengerWindow.drawList();
  }
}
