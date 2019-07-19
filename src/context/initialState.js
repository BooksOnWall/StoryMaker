// define context initial state
const initialState = {
  user: {
    name: '',
    avatar: false,
    authenticated: false,
  },
  themes: {
    'dark': {
      foreground: '#ffffff',
      background: '#222222',
    },
    'light': {
      foreground: '#000000',
      background: '#eeeeee',
    }
  },
  locale: {
    language: 'en',
    languages: {
      'en': {
        name: 'English',
        i18n: 'en_EN',
      },
      'es': {
        name: 'Espanol',
        i18n: 'es_ES',
      },
      'pt': {
        name: 'Portuguese',
        i18n: 'pt_PT',
      }
    }
  }
};
export default initialState;
