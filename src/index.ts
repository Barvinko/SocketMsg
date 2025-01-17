import './index.html';
import './index.scss';
import { Layout } from '@app/Layout';
import { Socket } from '@utils/Socket';
import { DisconnectEl } from '@components/disconnect/Disconnect';

document.body.className = 'body';
document.body.appendChild(DisconnectEl.getContainer());
(async () => {
  await Socket.createSocet();
  const layout: Layout = new Layout();
  layout.firstDraw();
})();
