import React, { Component } from 'react';

import {
  Step,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

class stageSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: this.props.sid,
      step: this.props.step,
      sstep: 'Stage'
    }
    this.handleSteps = this.handleSteps.bind(this);
  }
  handleSteps = (e) => {
    e.preventDefault();
    let sstep = (e.target.name) ? e.target.name : null;
    if (sstep) this.props.state.setSteps({sstep: sstep});
  }
  render() {
    return (
      <Step.Group fluid >
        <Step
          icon='map'
          active = {this.props.state.sstep === 'Stage'}
          completed = {this.props.state.storyCompleted}
          name='Stage'
          onClick={this.handleSSteps}
          title='Stage'
          description='things'
        />

        <Step
          active={this.props.state.sstep === 'geoPosition'}
          disabled ={(this.props.state.mode === 'update') ? false : true }
          icon='map marker alternate'
          name='GeoPosition'
          onClick={this.handleSSteps}
          title='GeoPosition'
          description='for the stage'
        />
        <Step
          active={this.props.state.sstep === 'augmentedReality'}
          disabled ={(this.props.state.mode === 'update') ? false : true }
          icon='road'
          name='augmentedReality'
          onClick={this.handleSSteps}
          title='augmentedReality'
          description='for the stage'
        />
      </Step.Group>
    );
  }
}
export default stageSteps;
