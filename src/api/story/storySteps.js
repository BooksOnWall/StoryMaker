import React, { Component } from 'react';

import {
  Step,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

class storySteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: this.props.sid,
      mapPath: (this.props.active === 'Map') ? window.location.reload : this.props.sid + '/map',
      stagesPath: (this.props.active === 'Stages') ? window.location.reload : this.props.sid + '/stages',
      step: this.props.step,
      steps: [{

          index: 0,
          name: 'Story',
          desc: 'things',
          icon: 'star',
          title: 'Story',
          url: '/storie/' + this.props.sid
        },
        {
          index: 1,
          name: 'Sinopsys',
          desc: 'of the story',
          icon: 'sun',
          title: 'Sinopsys',
          url: '/storie/' + this.props.sid
        },
        {
          index: 2,
          name: 'Stages',
          desc: 'of the story',
          icon: 'google wallet',
          title: 'Stages',
          url: '/storie/' + this.props.sid
        },
        {
         index: 3,
         name: 'Map',
         desc: 'of the story',
         icon: 'map',
         title: 'Map',
         url: '/storie/' + this.props.sid
       },
       {
        index: 4,
        name: 'Credits',
        desc: 'of the story',
        icon: 'credit card',
        title: 'Credits',
        url: '/storie/' + this.props.sid
      }]
    };
    this.handleSteps = this.handleSteps.bind(this);
  }
  handleSteps = (e) => {
    // get if we are in Stories pages or in Stage pages
    let url = this.props.location;
    console.log(url);
    e.preventDefault();
    let step = (e.target.name) ? e.target.name : null;
    if (step) this.props.state.setSteps({step: step});
  }
  render() {
    return (
      <Step.Group fluid >
        {this.state.steps.map(step => (
          <Step
            key={step.index}
            icon={step.icon}
            active = {this.props.state.step === step.name}
            name={step.name}
            onClick={this.handleSteps}
            as={Link}
            to={step.url}
            title={step.title}
            description={step.desc}
          />
        ))}
      </Step.Group>
    );
  }
}
export default storySteps;
