import React from 'react';
import ReactDOM  from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { addLocaleData, IntlProvider } from 'react-intl';
import enLocaleData from 'react-intl/locale-data/en';
import esLocaleData from 'react-intl/locale-data/es';
import ptLocaleData from 'react-intl/locale-data/pt';
import intlMessages_en from './i18n/locales/en.json';
import intlMessages_es from './i18n/locales/es.json';
import intlMessages_pt from './i18n/locales/pt.json';
import './index.css';
import App from './App';
import { ThemeProvider } from './context/ThemeContext';
import { UserProvider } from './context/UserContext';
import { LocaleProvider } from './context/LocaleContext';
import * as serviceWorker from './serviceWorker';
addLocaleData(enLocaleData);
addLocaleData(esLocaleData);
addLocaleData(ptLocaleData);

/* Define your translations */
let i18nConfig = {
    locale: 'en',
    messages: intlMessages_en
};
const language = navigator.language.split(/[-_]/)[0];
const switchLanguage = (lang) => {
  console.log(lang);
  switch (lang) {
    case 'es': i18nConfig.messages = intlMessages_es; break;
    case 'en': i18nConfig.messages = intlMessages_en; break;
    case 'pt': i18nConfig.messages = intlMessages_pt; break;
    default: i18nConfig.messages = intlMessages_en; break;
  }
  i18nConfig.locale = lang;
}
switchLanguage(language);
console.log(language);


ReactDOM.render(
<IntlProvider key={ i18nConfig.locale } locale={ i18nConfig.locale }  messages={ i18nConfig.messages }>
    <BrowserRouter forceRefresh={true}>
      <UserProvider>
        <LocaleProvider>
          <ThemeProvider>
            <App  />
          </ThemeProvider>
        </LocaleProvider>
      </UserProvider>
    </BrowserRouter>
</IntlProvider>, document.getElementById('root'));


// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
