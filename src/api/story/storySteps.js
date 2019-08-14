import React, { Component } from 'react';

import {
  Step,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

class storySteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: this.props.sid,
      mapPath: (this.props.active === 'Map') ? window.location.reload : this.props.sid + '/map',
      stagesPath: (this.props.active === 'Stages') ? window.location.reload : this.props.sid + '/stages',
      step: this.props.step
    }
    this.handleSteps = this.handleSteps.bind(this);
  }
  handleSteps = (e) => {
    e.preventDefault();
    let step = (e.target.name) ? e.target.name : null;
    if (step) this.props.state.setSteps({step: step});
  }
  render() {
    return (
      <Step.Group fluid ordered>
        <Step
          icon='star'
          active = {this.props.state.step === 'Story'}
          completed = {this.props.state.storyCompleted}
          name='Story'
          onClick={this.handleSteps}
          title='Story'
          description='Story things'
        />
        <Step
          active={this.props.state.step === 'Synopsys'}
          disabled ={(this.props.state.mode === 'update') ? false : true }
          completed = {this.props.state.synoCompleted}
          icon='sun'
          name='Sinopsys'
          onClick={this.handleSteps}
          title='Sinopsys'
          description='Sinopsys of the story'
        />
        <Step
          active={this.props.state.step === 'Stages'}
          disabled ={(this.props.state.mode === 'update') ? false : true }
          icon='google wallet'
          name='Stages'
          to={this.props.state.stagesPath}
          onClick={this.handleSteps}
          title='Stages'
          description='Stages of your story'
        />
        <Step
          active={this.props.state.step === 'Map'}
          disabled ={(this.props.state.mode === 'update') ? false : true }
          icon='map'
          name='Map'
          to={this.state.mapPath}
          onClick={this.handleSteps}
          title='Map'
          description='Design the map for this story'
        />
        <Step
          active={this.props.state.step === 'Credits'}
          disabled ={(this.props.state.mode === 'update') ? false : true }
          icon='credit card'
          name='Credits'
          onClick={this.handleSteps}
          title='Credits'
          description='Credits for this story'
        />
      </Step.Group>
    );
  }
}
export default storySteps;
