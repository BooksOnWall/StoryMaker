import React, { Component } from 'react';


import {
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
      sid: parseInt(this.props.sid),
      mode: (parseInt(this.props.sid) === 0) ? ('create') : ('update'),
    }
  }
  render() {
    if(this.props.step !== 'Stages') {return null}
    return (
      <Segment  className="view stages">
        <span>Stages</span>
      </Segment>
    );
  }
}
export default storyStages;
