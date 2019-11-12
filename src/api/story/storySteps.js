import React, { Component } from 'react';

import {
  Step,
  Icon,
} from 'semantic-ui-react';
import { Link, withRouter } from 'react-router-dom';

class storySteps extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';

    this.state = {
      server: server,
      sid: this.props.sid,
      mapPath: (this.props.active === 'Map') ? window.location.reload : this.props.sid + '/map',
      stagesPath: (this.props.active === 'Stages') ? window.location.reload : this.props.sid + '/stages',
      step: this.props.step,
      setStep: this.props.state.setStep,
      steps: [{
          index: 0,
          name: 'Story',
          desc: 'things',
          icon: 'book',
          title: 'Story',
          as: 'Link',
          to: '/stories/' + this.props.sid
        },
        {
          index: 1,
          name: 'Sinopsys',
          desc: 'of the story',
          icon: 'file alternate outline',
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
        icon: 'file text',
        title: 'Credits',
        as: 'Link',
        to: '/stories/' + this.props.sid + '/credits'
      }]
    };
    this.handleSteps = this.handleSteps.bind(this);
  }
  handleSteps = (e, to) => {
    // get if we are in Stories pages or in Stage pages
    //e.preventDefault();

    let step = (e.target.name) ? e.target.name : null;
    if (step) this.props.setSteps({step: step});
    console.log(step);
    //this.props.history.push(to);
  }
  render() {

    return (

      <Step.Group fluid className="inverted " size='mini'>
        {this.state.steps.map(step => (
          <Step
          name={step.name}
          key={step.index}
          active={this.props.state.step === step.name}
          disabled={this.state.sid === parseInt(0) }
          onClick={e => this.handleSteps(e, step.to)}
          as={Link}
          to={step.to}
          >
          <Icon name={step.icon} />
          <Step.Content>
          <Step.Title>{step.title}</Step.Title>

          </Step.Content>
          </Step>
        ))}
      </Step.Group>
    );
  }
}
export default withRouter(storySteps);
