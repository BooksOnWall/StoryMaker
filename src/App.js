import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  withRouter
} from 'react-router-dom';

import Auth from './module/Auth';

import AppMenu from './layout/AppMenu';
import Login from './api/user/Login';
import Logout from './api/user/Logout';
import SignUp from './api/user/SignUp';
import Users from './api/user/Users';
import User from './api/user/User';
import Profile from './api/user/Profile';

import Home from './page/HomePage';
import Dashboard from './page/Dashboard';

// import context
// directory conf
// import Context (User, Theme, Locale)
import UserContext from './context/UserContext';
import ThemeContext from './context/ThemeContext';
import LocaleContext from './context/LocaleContext';
import initialState from './context/initialState';

import './App.css';
import {
  Container,
  Segment,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const PrivateRoute = ({ component: Component, props: cProps, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Component {...props} {...cProps} {...rest} />
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
);
const LoggedOutRoute = ({ component: Component, props: cProps, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    ) : (
      <Component {...props} {...cProps} {...rest} />
    )
  )}/>
);

const PropsRoute = ({ component: Component, props: cProps, ...rest }) => (
  <Route {...rest} render={props => (
    <Component {...props} {...cProps} {...rest} />
  )}/>
);

class App extends Component {
  constructor(props) {
    super(props);
    let themes = initialState.themes;
    this.toggleTheme = () => {
      this.setState(state => ({
        theme:
          state.theme === themes.dark
            ? themes.light
            : themes.dark,
      }));
    };
    this.state = {
      authenticated: false,
      theme: themes.light,
      toggleTheme: this.toggleTheme,
    }
    this.updateState = this.updateState.bind(this);
  }
  async componentDidMount() {
    try {
      await Auth.isUserAuthenticated();
      this.toggleAuthenticateStatus();
    } catch(e) {
      if (e !== 'No current user') {
        console.log(e);
      }
    }
  }
  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  updateState(value) {
    this.setState({ value });
  }
  render () {
    const childProps = {
      authenticated: this.state.authenticated
    };

    return (
      <UserContext.Provider value={initialState.user} >
        <UserContext.Consumer>
          { user => (
            <LocaleContext.Provider user={user} value={initialState.locale}>
              <LocaleContext.Consumer>
                {locale => (
                  <ThemeContext.Provider user={user} locale={locale} value={initialState.theme}>
                    <ThemeContext.Consumer>
                      {theme => (
                        <div>
                          <Router childProps={childProps} >
                              <AppMenu childProps={childProps} user={user} locale={locale} theme={theme} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                              <Segment inverted vertical color='violet' style={{ height: '100vh', margin: '0em 0em 0em', padding: '5em 0em' }}>
                                <Container textAlign='center'>
                                  <Switch>
                                    <PropsRoute exact path="/" component={Home} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                    <PrivateRoute path="/dashboard" component={Dashboard} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                    <PrivateRoute exact path="/users" component={Users} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                    <PrivateRoute path="/users/:id" component={User} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                    <PrivateRoute path="/profile" component={Profile} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                    <LoggedOutRoute path="/login" component={Login} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                    <LoggedOutRoute path="/signup" component={SignUp} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} />
                                    <Route path="/logout" component={Logout} childProps={childProps} />
                                  </Switch>
                                </Container>
                              </Segment>
                          </Router>
                        </div>
                      )}
                    </ThemeContext.Consumer>
                  </ThemeContext.Provider>
                )}
              </LocaleContext.Consumer>
            </LocaleContext.Provider>
          )}
        </UserContext.Consumer>
      </UserContext.Provider>
    );
  }

}
export default withRouter(App);
