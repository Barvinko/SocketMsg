import { Component } from '@components/Component/Component';
import { Spans } from '@type/enums';
import { createSpans, createLink } from '@utils/createElement';
import rss from '@public/img/rss.svg';

export class Footer extends Component {
  constructor() {
    super('footer', 'footer');
    this.createLogo();
    this.createFooter();
  }

  private createLogo() {
    const containerImg = createLink(
      'footer__link-img',
      '',
      'https://rs.school/courses/javascript-mentoring-program',
      this._container,
    );
    containerImg.innerHTML = rss;
  }

  private createFooter() {
    createLink('footer__autor-git', '@Barvinko', 'https://github.com/Barvinko', this._container);
    createSpans('footer__data', '2024', this._container, Spans.SPAN);
  }
}
