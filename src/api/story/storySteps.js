import React, { Component } from 'react';

import {
  Step,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

import { Link } from 'react-router-dom';
class storySteps extends Component {
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
          active={this.state.active === 'Story'}
          icon='star'
          link
          num = {1}
          //onClick={this.setTab(1)}
          title='Edit Story'
          description='Story things'
        />
        <Step
          active={this.state.active === 'Synopsys'}
          icon='sun'
          link
          num = {2}
          //onClick={this.setTab(2)}
          title='Synopsys'
          description='Synopsys of the story'
        />
        <Step
          active={this.state.active === 'Stages'}
          icon='google wallet'
          link
          num = {4}
          as={Link}
          to={this.state.stagesPath}
          title='Stages'
          description='Stages of your story'
        />
        <Step
          active={this.state.active === 'Map'}
          icon='map'
          link
          num = {5}
          as={Link}
          to={this.state.mapPath}
          href='map'
          title='Map'
          description='Design the map for this story'
        />
        <Step
          active={this.state.active === 'Credits'}
          icon='credit card'
          link
          num = {3}
          //onClick={this.setTab(3)}
          title='Credits'
          description='Credits for this story'
        />
      </Step.Group>
    );
  }
}
export default storySteps;
