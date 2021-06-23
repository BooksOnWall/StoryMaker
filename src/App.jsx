import React, {useState} from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";
import {Helmet} from "react-helmet";
import { ToastContainer } from 'react-toastify';
import { useHistory } from "react-router-dom";
import { IntlProvider } from "react-intl";
import loadable from '@loadable/component';

import "@fontsource/roboto"; // Defaults to weight 400.
import "@fontsource/roboto-condensed"
import "@fontsource/roboto-condensed/700.css"
import "@fontsource/roboto-condensed/400.css"
import "@fontsource/source-sans-pro"

import 'react-toastify/dist/ReactToastify.css';

import intlMessages_en from './i18n/locales/en.json';
import intlMessages_es from './i18n/locales/es.json';
import intlMessages_pt from './i18n/locales/pt.json';
import intlMessages_fr from './i18n/locales/fr.json';
import intlMessages_it from './i18n/locales/it.json';

import '@formatjs/intl-relativetimeformat/polyfill';
import '@formatjs/intl-pluralrules/locale-data/en';
import '@formatjs/intl-pluralrules/locale-data/fr';
import '@formatjs/intl-pluralrules/locale-data/es';
import '@formatjs/intl-pluralrules/locale-data/pt';
import '@formatjs/intl-pluralrules/locale-data/it';

import './App.css';

const Layout = loadable(() => import('./template/Layout'));
const Routes = loadable(() => import('./Routes'));
const messages = {
  'en': intlMessages_en,
  'es': intlMessages_es,
  'pt': intlMessages_pt,
  'fr': intlMessages_fr,
  'it': intlMessages_it,
};
const getPathName =() =>  window.location.href.replace(process.env.REACT_APP_URL, '').substring(1);
const App = () => {
  const pathname = getPathName();
  // get first url entry
  let path = decodeURIComponent(pathname.split('/')[0]);
  const checkLocale = () => {
    if(path !== '') {
        // locale and url are different
        let locale = null;
        for (const [key, value] of Object.entries(messages)) {
            for (const [mkey, mvalue] of Object.entries(value.menu)) {
              if(mvalue === path) {
                locale = key;
              }
            }
        }
        return locale;

    } else {
      return false;
    }
  }
  const localeFromUrl = checkLocale();
  let navLocale =  (navigator.languages && navigator.languages[0])
                 || navigator.language
                 || navigator.userLanguage
                 || 'en';
  navLocale = (localeFromUrl) ? localeFromUrl :  navLocale.split("-")[0];
  const [locale, setLocale] = useState(navLocale);
  const switchLang = locale => setLocale(locale);

  const checkLang = pathname => {
    // verify that the url passed correspond to the good lang or locale
    const page = pathname.substring(1);
    if(page) {
      // check that locale correspond to the page if no change it
      const menu = messages[locale]["menu"];
      let exist = false;
      for (const [value] of Object.entries(menu)) {
        if(value === page) exist = true;
      }
      if(!exist) {
        // locale and url are different
        for (const [key, value] of Object.entries(messages)) {
          if(key !== locale) {
            for (const [mvalue] of Object.entries(value.menu)) {
              if(mvalue === page) {
                switchLang(key);
              }
            }
          }
        }
      }
    }
  }
  return (
    <IntlProvider key={locale} locale={locale} messages={messages[locale]}>
      <Router>
        <Route render={({ location, history }) => {
          checkLang(location.pathname);
          return (
            <Layout locale={locale} allMessages={messages} switchLang={switchLang} history={history}>
              <Routes messages={messages} history={history} locale={locale}/>
            </Layout>
          );
        }}/>
      </Router>
    </IntlProvider>
  )
}

export default App;
