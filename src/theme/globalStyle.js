import { createGlobalStyle } from 'styled-components';

export const themes = {
  dark: {
    key: 'dark',
    value: 'dark',
    text: 'Dark theme',
    primary: '#ff0198',
    secondary: '#01c1d6',
    danger: '#e50000',
    fontheader: 'Old Standard TT, sans, sans-serif',
    fontbody: 'Nunito, sans-serif'
  },
  light: {
    key: 'light',
    value: 'light',
    text: 'Light theme',
    primary: '#6e27c5',
    secondary: '#ffb617',
    danger: '#ff1919',
    fontheader: 'Enriqueta, sans-serif',
    fontbody: 'Exo 2, sans, sans-serif'
  },
  custom: {
    key: 'custom',
    value: 'custom',
    text: 'Custom theme',
    primary: '#f16623',
    secondary: '#2e2e86',
    danger: '#cc0000',
    fontheader: 'Kaushan Script, sans, sans-serif',
    fontbody: 'Headland One, sans-serif'
  }
};
export const GlobalStyle = createGlobalStyle`
@import url('https://fonts.googleapis.com/css?family=Old+Standard+TT:400,700|Nunito:400,700|Enriqueta:400,700|Exo+2:400,700|Kaushan+Script:400,700|Headland+One:400,700');

body {
  padding: 0;
  margin: 0;
}`;
