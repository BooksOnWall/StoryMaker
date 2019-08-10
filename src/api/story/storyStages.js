import React, { Component } from 'react';
import StorySteps from './storySteps';

import {
  Step,
  Segment,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

class storyStages extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      active: 'Stages',
      server: server,
      sid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
      mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
    }
  }
  render() {
    return (
      <Segment fluid>
        <StorySteps sid={this.state.sid} active={this.state.active}/>
      </Segment>
    );
  }
}
export default storyStages;
