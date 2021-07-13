import { injectIntl } from 'react-intl';

const helpSummary = (messages) => {
  return [
    {id: 0, name: messages.menu.about},
    {id: 1, name: messages.menu.events},
    {id: 2, name: messages.menu.layers},
    {id: 3, name: messages.menu.timeline},
    {id: 4, name: messages.menu.options},
    {id: 5, name: messages.menu.elements},
    {id: 6, name: messages.menu.translate},
    {id: 7, name: messages.menu.configure},
    {id: 8, name: messages.menu.save},
    {id: 9, name: messages.menu.duplicate},
    {id: 10, name: messages.menu.publish},
    {id: 11, name: messages.menu.share},
    {id: 12, name: messages.menu.contribute},
  ];
}
export default helpSummary;
