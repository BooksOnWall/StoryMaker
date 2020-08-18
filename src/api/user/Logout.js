import React, { Component } from 'react';
import Auth from '../module/Auth';
import {  FormattedMessage } from 'react-intl';


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
        <p><FormattedMessage id="user.logout" defaultMessage={`Logging out`}/></p>
      </div>
    )
  }
}
export default Logout;
