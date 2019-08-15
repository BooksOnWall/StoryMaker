import React, { Component } from 'react';

import {
  Step,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

class userSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aid: this.props.aid,
      active: this.props.step
    }
  }
  handleSteps = (e) => {
    e.preventDefault();
    let step = (e.target.name) ? e.target.name : null;
    let to = (e.target.to && e.target.link) ? e.taget.to : null;
    if (step) this.props.state.setSteps({step: step});
    if(to) this.props.history.push(to);
  }
  render() {

    return (
      <Step.Group fluid >
        <Step
          active={this.props.state.step === 'User'}
          icon='user'
          disabled = {false}
          name='User'
          onClick={this.handleSteps}
          title='Edit User'
          description='Edit user things'
        />
        <Step
          active={this.props.state.step === 'Password'}
          icon='user secret'
          disabled ={(this.props.state.userEdit.mode === 'update') ? false : true }
          name='Password'
          onClick={this.handleSteps}
          title='Password'
          description='Change user password'
        />
        <Step
          active={this.props.state.step === 'Preferences'}
          icon='wordpress forms'
          disabled ={(this.props.state.userEdit.mode === 'update') ? false : true }
          name='Preferences'
          onClick={this.handleSteps}
          title='Preferences'
          description='User preferences'
        />
        <Step
          active={this.props.state.step === 'Avatar'}
          icon='user circle'
          disabled ={(this.props.state.userEdit.mode === 'update') ? false : true }
          name='Avatar'
          onClick={this.handleSteps}
          title='Avatar'
          description='User avatar'
        />
      </Step.Group>
    );
  }
}
export default userSteps;
