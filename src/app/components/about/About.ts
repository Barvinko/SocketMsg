import { Dialog } from '@components/Dialog/Dialog';
import { Spans } from '@type/enums';
import { createSpans, createElement, createDiv, createButton, createLink } from '@utils/createElement';

export class About extends Dialog {
  constructor() {
    super('about');
    this.createDialog();
  }

  private createDialog() {
    const containerDialog = createDiv('about__container', this._dialog);

    createSpans('about__title', 'Fun Chat', containerDialog, Spans.H3);
    const text = createElement('p', 'about__text', containerDialog);
    text.innerText = `The application is designed to demonstrate the Fun Chat assignment in the RSSchool JS`;

    createLink('footer__autor-git', '@Barvinko', 'https://github.com/Barvinko', containerDialog);

    const aboutButton = createButton('button about__exit', 'Return', containerDialog);
    aboutButton.addEventListener('click', () => this._dialog.close());
  }
}

export const AboutEl = new About();
