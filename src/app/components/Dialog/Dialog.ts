import { Component } from '@components/Component/Component';

export class Dialog extends Component {
  protected _dialog: HTMLDialogElement;

  constructor(className: string) {
    super('dialog', `dialog ${className}`);
    this._dialog = this._container as HTMLDialogElement;
  }

  public getContainer(): HTMLDialogElement {
    return this._dialog;
  }
}
