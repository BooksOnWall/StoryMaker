import React, { Component } from 'react';
import Auth from '../../module/Auth';


class Logout extends Component {
  logout() {
    // deauthenticate user
    Auth.deauthenticateUser();
    // change the current URL to / after logout
    this.props.history.push('/');
  }
  componentDidMount() {
    this.logout();
  }

  render() {
    return (
      <div>
        <p>Logging out...</p>
      </div>
    )
  }
}
export default Logout;
