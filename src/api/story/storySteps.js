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
    this.handleSteps = this.handleSteps.bind(this);
  }
  handleSteps = (e) => {
    e.preventDefault();
    let active = (e.target.name) ? e.target.name : null;
    let to = (e.target.to && e.target.link) ? e.taget.to : null;
    console.log(e.target.link);
    if (active) this.props.state.setSteps({active: active});
    if(to) this.props.history.push(to);
  }
  render() {
    return (
      <Step.Group fluid ordered>
        <Step
          active={this.props.state.active === 'Story'}
          icon='star'
          link
          name='Story'
          num = {1}
          onClick={this.handleSteps}
          title='Story'
          description='Story things'
        />
        <Step
          active={this.props.state.active === 'Synopsys'}
          icon='sun'
          link
          num = {2}
          name='Synopsys'
          to='synopsis'
          onClick={this.handleSteps}
          title='Synopsys'
          description='Synopsys of the story'
        />
        <Step
          active={this.props.state.active === 'Stages'}
          icon='google wallet'
          link
          num = {4}
          as={Link}
          name='Stages'
          to={this.props.state.stagesPath}
          onClick={this.handleSteps}
          title='Stages'
          description='Stages of your story'
        />
        <Step
          active={this.props.state.active === 'Map'}
          icon='map'
          link
          num = {5}
          as={Link}
          name='Map'
          to={this.state.mapPath}
          onClick={this.handleSteps}
          href='map'
          title='Map'
          description='Design the map for this story'
        />
        <Step
          active={this.state.active === 'Credits'}
          icon='credit card'
          link
          num = {3}
          onClick={this.handleSteps}
          title='Credits'
          description='Credits for this story'
        />
      </Step.Group>
    );
  }
}
export default storySteps;
