import React from "react";
import {
  Switch,
  Route
} from "react-router-dom";
import loadable from '@loadable/component';
const Home = loadable(() => import('./page/HomePage'));

const Routes = ({messages, history, locale}) => (
    <Switch>
      <Route exact path="/"> <Home history={history} /> </Route>
    </Switch>
);
export default Routes
