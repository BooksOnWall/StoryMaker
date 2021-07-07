import React from "react";
import {
  Switch,
  Route
} from "react-router-dom";
import loadable from '@loadable/component';
const Editor = loadable(() => import('./page/Editor'));

const Routes = ({messages, history, locale}) => (
    <Switch>
      <Route exact path="/"> <Editor history={history} /> </Route>
    </Switch>
);
export default Routes
