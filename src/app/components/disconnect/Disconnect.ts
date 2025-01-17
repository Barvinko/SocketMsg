import { Dialog } from '@components/Dialog/Dialog';
import { Spans } from '@type/enums';
import { createSpans } from '@utils/createElement';

export class Disconnect extends Dialog {
  constructor() {
    super('disconnect');
    createSpans('disconnect_title', 'Trying to connect to server', this._dialog, Spans.H1);
  }
}

export const DisconnectEl = new Disconnect();
