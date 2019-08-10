import React, { Component } from 'react';

import {
  Step,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
class userSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aid: this.props.aid,
      active: this.props.active
    }
  }
  render() {

    return (
      <Step.Group fluid ordered>
        <Step
          active={this.state.active === 'User'}
          icon='user'
          link
          num = {1}
          title='Edit User'
          description='Edit user things'
        />
        <Step
          active={this.state.active === 'Password'}
          icon='user secret'
          link
          num = {2}
          title='Password'
          description='Change user password'
        />
        <Step
          active={this.state.active === 'Preferences'}
          icon='wordpress forms'
          link
          num = {3}
          title='Preferences'
          description='User preferences'
        />
        <Step
          active={this.state.active === 'Avatar'}
          icon='user circle'
          link
          num = {3}
          title='Avatar'
          description='User avatar'
        />
      </Step.Group>
    );
  }
}
export default userSteps;
