import React from "react";
import {
  Switch,
  Route
} from "react-router-dom";
import loadable from '@loadable/component';
const Editor = loadable(() => import('./components/Editor'));

const Routes = ({switchLang, messages, history, locale}) => {
  console.log('routes', switchLang);
  return (
    <Switch>
      <Route exact path="/"> <Editor switchLang={switchLang} messages={messages[locale]} allMessages={messages} history={history} locale={locale} /> </Route>
    </Switch>
)};
export default Routes
