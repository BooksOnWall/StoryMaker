import React, { Component } from 'react';

import {
  Icon,
  Button,
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
      <Button.Group>
        <Button primary name='Stage' onClick={this.handleSSteps}><Icon name="google wallet" />Stage</Button>
        <Button.Or />
       <Button name="geoposition"><Icon name="map marker alternate" />GeoPosition</Button>
       <Button.Or />
       <Button positive name="augmentedReality"><Icon name="road" /> Augmented Reality</Button>
     </Button.Group>
    );
  }
}
export default stageSteps;
