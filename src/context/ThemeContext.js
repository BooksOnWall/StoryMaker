
import React from 'react';
import initialState from './initialState';
const ThemeContext = React.createContext({
  theme: initialState.themes.dark,
  toggleTheme: () => {},
});
export default ThemeContext;
