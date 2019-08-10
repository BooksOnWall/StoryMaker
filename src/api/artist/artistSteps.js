import React, { Component } from 'react';

import {
  Step,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
class artistSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: this.props.sid,
      mapPath: (this.props.active === 'Map') ? window.location.reload : this.props.sid + '/map',
      stagesPath: (this.props.active === 'Stages') ? window.location.reload : this.props.sid + '/stages',
      active: this.props.active
    }
  }
  render() {

    return (
      <Step.Group fluid ordered>
        <Step
          active={this.state.active === 'Artist'}
          icon='area graph'
          link
          num = {1}
          title='Edit Artist'
          description='Edit artists things'
        />
        <Step
          active={this.state.active === 'Images'}
          icon='images'
          link
          num = {2}
          title='Images'
          description='Upload artist images'
        />
        <Step
          active={this.state.active === 'Bio'}
          icon='images'
          link
          num = {3}
          title='book'
          description='Artist Biography'
        />
      </Step.Group>
    );
  }
}
export default artistSteps;
