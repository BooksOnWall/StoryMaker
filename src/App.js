import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Redirect
} from 'react-router-dom';

import AppMenu from './layout/AppMenu';
import Home from './page/HomePage';
import Login from './component/user/Login';
import Logout from './component/user/Logout';
import SignUp from './component/user/SignUp';
import Dashboard from './page/Dashboard';
import Users from './component/user/Users';
import Profile from './component/user/Profile';
import Auth from './module/Auth';
import './App.css';
import {
  Container,
  Segment,
} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Component {...props} {...rest} />
    ) : (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    )
  )}/>
);
const LoggedOutRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    Auth.isUserAuthenticated() ? (
      <Redirect to={{
        pathname: '/',
        state: { from: props.location }
      }}/>
    ) : (
      <Component {...props} {...rest} />
    )
  )}/>
);

const PropsRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    <Component {...props} {...rest} />
  )}/>
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false
    }
  }

  componentDidMount() {
    // check if user is logged in on refresh
    this.toggleAuthenticateStatus()
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }

  render () {
    return (
      <Router>
          <div>
            <AppMenu toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
            <Segment inverted vertical color='violet' style={{ height: '100vh', margin: '0em 0em 0em', padding: '5em 0em' }}>
              <Container textAlign='center'>
                <PropsRoute exact path="/" component={Home} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                <PrivateRoute path="/dashboard" component={Dashboard} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                <PrivateRoute path="/users" component={Users} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                <PrivateRoute path="/profile" component={Profile} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                <LoggedOutRoute path="/login" component={Login} toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
                <LoggedOutRoute path="/signup" component={SignUp}/>
                <Route path="/logout" component={Logout}/>
              </Container>
            </Segment>
          </div>
        </Router>
    );
  }

}

export default App;
