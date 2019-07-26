import React, { Component } from 'react';
import Auth from '../../../module/Auth';
import {
  Segment,
  Divider,
  Dropdown,
} from 'semantic-ui-react';

class storyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false
    }
  };
  componentDidMount() {
    // check if user is logged in on refresh
    this.toggleAuthenticateStatus()
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  render() {
    return (
      <div>Map</div>
    );
  }
}
export default storyMap;
