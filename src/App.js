import React, { Component } from 'react';

import {
  BrowserRouter as Router,
  Route,
  Redirect,
  Switch,
  withRouter,

} from 'react-router-dom';

import Auth from './module/Auth';

import AppMenu from './layout/AppMenu';
import LeftSlideMenu from './layout/slideMenu';
import Login from './api/user/Login';
import Logout from './api/user/Logout';
import SignUp from './api/user/SignUp';
import Users from './api/user/Users';
import User from './api/user/User';
import Artists from './api/artist/Artists';
import Artist from './api/artist/Artist';
import Stories from './api/story/Stories';
import Story from './api/story/Story';
import Stage from './api/story/stage/Stage';


import Profile from './api/user/Profile';

import Home from './page/HomePage';
import Dashboard from './page/Dashboard';

// import context
// directory conf
// import Context (User, Theme, Locale)
import { themes } from './theme/globalStyle';
import { users } from './api/user//globalUser';
import { locales } from './i18n/locales/globalLocales';
import UserContext from './context/UserContext';
import ThemeContext from './context/ThemeContext';
import LocaleContext from './context/LocaleContext';

import './App.css';
import {
  Segment,
  Sidebar,
  Menu,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';

const PrivateRoute = ({ component: Component, props: cProps, ...rest }) =>(
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
    this.setTheme = (key) => {
      this.setState(state => ({
        theme:themes.$key,
      }));
    };
    this.setLocale = (key) => {
      this.setState(state => ({
        locale: locales.$key,
      }));
    };
    this.setAvatar = (avatar) => {
      this.setState(state => ({
        user: {
          theme: this.state.theme,
          locale: this.state.locale,
          avatar: avatar
        }
      }));
    };
    this.setUser = (user) => {
      this.setState(state => ({
        user: Auth.getDatas()
      }));
    };
    this.updateUserPreferences = (prefs) => {
      console.log(prefs);
      this.setState(state => ({
        user: {
          theme: prefs.theme,
          locale: prefs.locale,
          avatar: prefs.avatar,
        }
      }));
    };
    this.setUserPreferences = (prefs) => {
      this.setState(state => ({
        user: {
          theme: prefs.theme,
          locale: prefs.locale,
          avatar: prefs.avatar,
        }
      }));
    };
    this.toggleAuthenticateStatus= () =>  {
      // check authenticated status and toggle state based on that
      this.setState({ authenticated: Auth.isUserAuthenticated() });
      this.setState({user: Auth.getDatas()});
    };
    this.state = {
      authenticated: false,
      theme: 'light',
      themes: themes,
      users: users,
      locales: locales,
      sidebarVisible: true,
      setUserPreferences: this.setUserPreferences,
      toggleAuthenticateStatus: this.toggleAuthenticateStatus,
      setUser: this.setUser,
      setAvatar: this.setAvatar,
      setTheme: this.setTheme,
      handleSideBar: this.handleSideBar,
      animation: 'slide along',
      direction: 'left',
      dimmed: null,
      locale: locales.locale.language,
      setLocale: this.setLocale,
      user: (this.authenticated) ? Auth.getDatas() : users.user,
    };
    this.handleSideBar= this.handleSideBar.bind(this);
    this.setTheme = this.setTheme.bind(this);
    this.setLocale = this.setLocale.bind(this);
    this.toggleAuthenticateStatus = this.toggleAuthenticateStatus.bind(this);
  }
  handleSideBar = () => {
    (!this.state.sidebarVisible) ? this.setState({sidebarVisible: true }) : this.setState({sidebarVisible: false }) ;
  }
  async componentDidMount() {
    try {
      await this.toggleAuthenticateStatus();
    } catch(e) {
      if (e !== 'No current user') {
        console.log(e);
      }
    }
  }
  handleSidebarHide = () => this.setState({ sidebarVisible: false })
  render () {
    const childProps = {
      authenticated: this.state.authenticated,
      user: this.state.user
    };

    return (
        <UserContext.Consumer value={{state: this.state}} users={users}>
          { user => (
              <LocaleContext.Consumer value={{state: this.state}} users={users} locales={locales}>
                {locale => (
                    <ThemeContext.Consumer value={{state: this.state}} users={users} locales={locales} themes={themes}>
                      {theme => (
                          <Router childProps={childProps} >
                            <Sidebar.Pushable as={Segment} style={{textAlign: 'left'}}>
                              <Sidebar as={Menu}
                                animation={this.state.animation}
                                icon='labeled'
                                vertical
                                className='bwSidebar'
                                style={{padding: 0}}
                                dimmed={this.state.dimmed}
                                onHide={this.handleSidebarHide}
                                direction={this.state.direction}
                                visible={this.state.sidebarVisible}
                              >
                                <LeftSlideMenu  state={this.state} childProps={childProps} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()}/>
                              </Sidebar>

                              <Sidebar.Pusher onClick={this.state.handleSidebarHide} dimmed={this.state.dimmed && this.state.sidebarVisible}>
                                <Segment className="main"  vertical fluid='true'  style={{fontSize: '1.8em'}}>
                                  <AppMenu childProps={childProps} state={this.state} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                  <Route render={({ location }) => {
                                      return (
                                        <Switch  location={location}>
                                          <PropsRoute exact path="/" component={Home} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute path="/dashboard"   component={Dashboard} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute exact path="/users"  component={Users} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute path="/users/:id"  state={this.state} component={User} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute exact path="/artists" component={Artists} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute path="/artists/:id"   component={Artist} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute exact path="/stories"   component={Stories} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute exact path="/stories/:id"  component={Story} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute exact path="/stories/:id/sinopsys"  component={Story} step="Sinopsys" childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute exact path="/stories/:id/stages"  component={Story} step="Stages"  childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute exact path="/stories/:id/map"  component={Story} step="Map" childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute exact path="/stories/:id/credits"  component={Story} step="Credits" childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute exact path="/stories/:id/stages/:sid"  component={Stage} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <PrivateRoute path="/profile"  component={Profile} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <LoggedOutRoute path="/login"  state={this.state} setUser={this.state.setUser} component={Login} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                                          <LoggedOutRoute path="/signup"  component={SignUp} childProps={childProps} user={user} locale={locale} theme={theme} authenticated={user.authenticated} />
                                          <Route path="/logout"  component={Logout} childProps={childProps} />
                                        </Switch>
                                      );
                                    }}/>
                                  </Segment>
                                </Sidebar.Pusher>
                              </Sidebar.Pushable>
                          </Router>

                      )}
                    </ThemeContext.Consumer>
                )}
              </LocaleContext.Consumer>
          )}
        </UserContext.Consumer>
    );
  }

}
export default withRouter(App);
