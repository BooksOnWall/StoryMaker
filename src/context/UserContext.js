import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { users } from '../api/user/globalUser';

// Context is made up of two things
// Provider - Single as close to top level as possible
// Consumer - Multiple have multiple consumers
const UserContext = React.createContext('user');
export default UserContext;

export class UserProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: users['']
    };
  }
  handleUserChange = e => {
    const key = e.target.value;
    const user = users[key];
    this.setState({ user });
  };
  render() {
    return (
      <UserContext.Provider
        value={{
          ...this.state,
          handleUserChange: this.handleUserChange
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

UserProvider.propTypes = {
  children: PropTypes.any
};
