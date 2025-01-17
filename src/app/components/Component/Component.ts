import { createElement } from '@app/utils/createElement';

export class Component {
  protected _container: HTMLElement;

  constructor(tag: string, className: string) {
    this._container = createElement(tag, className);
  }

  public getContainer(): HTMLElement {
    return this._container;
  }
}
