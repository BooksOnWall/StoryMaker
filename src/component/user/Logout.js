import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Auth from '../../module/Auth';


class Logout extends Component {

  componentDidMount() {
    // deauthenticate user
    Auth.deauthenticateUser();
    // change the current URL to / after logout
    this.props.history.push('/');
  }

  render() {
    return (
      <div>
        <p>Logging out...</p>
      </div>
    )
  }
}

Logout.contextTypes = {
  router: PropTypes.object.isRequired
};

export default Logout;
