import { Component } from '@components/Component/Component';
import { createElement, createLabel, createInput, createButton } from '@utils/createElement';
import { User, SocketData, AnswerError, Payload, PayloadUser } from '@type/type';
import { generateId } from '@utils/generateId';
import { TypeSocket } from '@app/types/enums';
import { UserStorage } from '@utils/LocalStorage';
import { Socket } from '@utils/Socket';
import { objectEqual } from '@utils/objectEqual';
import { AboutEl } from '@components/about/About';

type PatternSigIn = {
  pattern: string;
  erorrMessage: string;
};

export type InputDate = {
  input: HTMLInputElement;
  patterns: PatternSigIn[];
  fieldError: HTMLSpanElement;
};

export class SignIn extends Component {
  private _buttonForm!: HTMLButtonElement;

  private _form!: HTMLFormElement;

  private _name!: InputDate;

  private _password!: InputDate;

  constructor() {
    super('article', 'article container sign-in');

    this.createSignIn();
    this.setParameters();
  }

  private createSignIn() {
    this._form = createElement('form', 'sign-in__form', this._container) as HTMLFormElement;

    createLabel('sign-in__label', 'sign-in__name', 'Name:', this._form) as HTMLLabelElement;
    this._name = {
      input: createInput('sign-in__input sign-in__name', 'Enter name', this._form) as HTMLInputElement,
      patterns: [
        { pattern: '[A-Z].*', erorrMessage: 'first letter must be capitalised' },
        { pattern: '^.{1}[a-z]*$', erorrMessage: 'after first letter must be lowercase or hyphen' },
        { pattern: '.{3,}.*', erorrMessage: 'minimum characters 3' },
      ],
      fieldError: createElement('span', 'sign-in__error', this._form),
    };

    createLabel('sign-in__label', 'sign-in__password', 'Password:', this._form) as HTMLLabelElement;
    this._password = {
      input: createInput('sign-in__input sign-in__name', 'Enter surname', this._form) as HTMLInputElement,
      patterns: [
        { pattern: '[0-9]', erorrMessage: 'need number' },
        { pattern: '[a-zA-Z]', erorrMessage: 'need english letters' },
        { pattern: '[^-]*', erorrMessage: 'can`t use -' },
        { pattern: '.{4,}.*', erorrMessage: 'must be longer than 4 characters' },
        { pattern: '[A-Z]', erorrMessage: 'don`t have uppercase' },
      ],
      fieldError: createElement('span', 'sign-in__error', this._form),
    };
    this._password.input.type = 'password';

    this._buttonForm = createElement('button', 'button sign-in__send', this._form) as HTMLButtonElement;
    const aboutButton = createButton('button sign-in__send', 'About', this._form);
    aboutButton.type = 'button';
    aboutButton.addEventListener('click', () => {
      AboutEl.getContainer().show();
    });
  }

  private setParameters(): void {
    this._name.input.addEventListener('input', () => {
      this.checkLetter(this._name.input);
      this.checkInputs(this._name);
    });

    this._password.input.addEventListener('input', () => {
      this.checkLetter(this._password.input);
      this.checkInputs(this._password);
    });

    this._buttonForm.innerText = 'Login';
    this._buttonForm.disabled = true;
  }

  public async enter(drawMessager: () => void) {
    let user: User | null = UserStorage.getData();
    const userInput: User = {
      login: this._name.input.value,
      password: this._password.input.value,
    };
    if (!user) {
      user = userInput;
    }

    const request: SocketData<Payload> = {
      id: generateId(),
      type: TypeSocket.USER_LOGIN,
      payload: {
        user,
      },
    };
    let response: AnswerError | SocketData<PayloadUser> | undefined = await Socket.sendRequest(request);
    if (!response) return;

    if (response.type === TypeSocket.ERROR) {
      response = response as AnswerError;
      this._password.fieldError.innerText = response.payload.error;

      if (
        UserStorage.getData() &&
        this._buttonForm.disabled === false &&
        !objectEqual(UserStorage.getData(), userInput)
      ) {
        this._password.fieldError.innerText = 'To log in to another account, log out of your current account';
      }

      const messenger = document.querySelector('.messenger');
      if (messenger && messenger.parentElement) {
        messenger.parentElement.replaceChild(this._container, messenger);
      }
      return;
    }

    UserStorage.setData(user);
    drawMessager();
  }

  public getForm(): HTMLFormElement {
    return this._form;
  }

  private checkLetter(input: HTMLInputElement): void {
    const regex = /[^A-Za-z0-9]/g;
    const newValue = input.value.replace(regex, '');
    input.value = newValue;
  }

  private checkInputs({ input, fieldError }: InputDate): void {
    function checkPatterns({ input: inputData, patterns }: InputDate): string {
      return patterns
        .map(({ pattern, erorrMessage }) => {
          const resultTest = new RegExp(pattern).test(inputData.value);
          return resultTest ? '' : `${erorrMessage}\n`;
        })
        .join('');
    }

    const nameValid = checkPatterns(this._name);
    const surnameValid = checkPatterns(this._password);
    const valid = this._name.input === input ? nameValid : surnameValid;

    this._buttonForm.disabled = Boolean(nameValid) || Boolean(surnameValid);
    fieldError.innerText = !valid ? ' ' : valid;
  }
}
