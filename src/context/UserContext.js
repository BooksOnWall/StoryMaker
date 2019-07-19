
import React from 'react';
import initialState from './initialState';
const UserContext = React.createContext({
  user: initialState.user,
  toggleUser: () => {},
});
export default UserContext;
