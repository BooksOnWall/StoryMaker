
import React from 'react';
import initialState from './initialState';
const LocaleContext = React.createContext({
  locale: initialState.locale.language,
  toggleLocale: () => {},
});
export default LocaleContext;
