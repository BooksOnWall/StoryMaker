import React, { Component } from 'react';

import {
  Step,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { FormattedMessage, defineMessages } from 'react-intl';

class storySteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: this.props.sid,
      mapPath: (this.props.active === 'Map') ? window.location.reload : this.props.sid + '/map',
      stagesPath: (this.props.active === 'Stages') ? window.location.reload : this.props.sid + '/stages',
      step: this.props.step,
      setStep: this.props.state.setStep,
      steps: [{
          index: 0,
          name: 'Story',
          desc: 'things',
          icon: 'star',
          title: 'Story',
          as: 'Link',
          to: '/stories/' + this.props.sid
        },
        {
          index: 1,
          name: 'Sinopsys',
          desc: 'of the story',
          icon: 'sun',
          title: 'Sinopsys',
          as: 'Link',
          to: '/stories/' + this.props.sid + '/sinopsys'
        },
        {
          index: 2,
          name: 'Stages',
          desc: 'of the story',
          icon: 'google wallet',
          title: 'Stages',
          as: 'Link',
          to: '/stories/' + this.props.sid + '/stages'
        },
        {
         index: 3,
         name: 'Map',
         desc: 'of the story',
         icon: 'map',
         title: 'Map',
         as: 'Link',
         to: '/stories/' + this.props.sid + '/Map'
       },
       {
        index: 4,
        name: 'Credits',
        desc: 'of the story',
        icon: 'credit card',
        title: 'Credits',
        as: 'Link',
        to: '/stories/' + this.props.sid + '/credits'
      }]
    };
    this.handleSteps = this.handleSteps.bind(this);
  }
  handleSteps = (e) => {
    // get if we are in Stories pages or in Stage pages
    //e.preventDefault();
    let step = (e.target.name) ? e.target.name : null;
    let url = (e.target.href) ? e.target.href : null;
    console.log(url);
    if (step) this.props.setSteps({step: step});
    //this.props.history.push(url);
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
            to={step.to}
            title= {step.title}
        
            // {defineMessages({stepstitle: { id: 'app.story.storySteps.steps.title', defaultMessage: [step.title] }})}
        
           // description={<FormattedMessage id="app.story.storySteps.edit"  defaultMessage={step.desc} />}
          />
        ))}
      </Step.Group>
    );
  }
}
export default storySteps;
