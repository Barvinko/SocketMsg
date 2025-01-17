import { SignIn } from '@components/signIn/SignIn';
import { Messenger } from '@components/messenger/Messenger';
import { UserStorage } from '@utils/LocalStorage';
import { Socket } from '@utils/Socket';
import { AboutEl } from '@components/about/About';

export class Layout {
  private _signIn: SignIn;

  private _messenger: Messenger;

  constructor() {
    this._signIn = new SignIn();
    this._messenger = new Messenger();

    Socket.setEnter(async () => this.drawMessager());

    if (UserStorage.getData()) {
      this.drawMessager();
    }

    this._signIn.getForm().addEventListener('submit', (event: Event) => {
      event.preventDefault();
      this.drawMessager();
    });

    document.addEventListener('keypress', this.handleKeyPress);

    const exitButton = this._messenger.getContainer().querySelector('.header__exit') as HTMLButtonElement;
    if (exitButton) {
      exitButton.addEventListener('click', () => {
        this.draw(this._signIn.getContainer());
      });
    }

    document.body.appendChild(AboutEl.getContainer());
  }

  private draw(layout: HTMLElement): void {
    const haveContainer: HTMLDivElement | null = document.querySelector('.article');
    if (haveContainer && haveContainer.parentElement) haveContainer.parentElement.replaceChild(layout, haveContainer);
  }

  public firstDraw(): void {
    document.body.appendChild(this._signIn.getContainer());
  }

  private async drawMessager() {
    await this._signIn.enter(() => this.draw(this._messenger.getContainer()));
    this._messenger.setHeaderName();
  }

  handleKeyPress(event: KeyboardEvent) {
    const login: HTMLButtonElement | null = document.querySelector('.sign-in__send');
    if (event.key === 'Enter' && login && login.disabled === false) {
      this.drawMessager();
    }
  }
}
