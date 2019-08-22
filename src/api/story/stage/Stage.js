import React, { Component } from 'react';

import {
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import StorySteps from '../storySteps';
import StageSteps from './stageSteps';
import { Link } from 'react-router-dom';

class stage extends Component {
  constructor(props) {
      super(props);
      let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
      let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
      let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
      this.state = {
        server: server,
        stories: server + 'stories',
        artists: server + 'artists',
        sid: this.props.sid,
        ssid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
        mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
        name: null,
        stages: '/stories/' + this.props.match.params.id + '/stages',
        map:  '/stories/' + this.props.match.params.id + '/map',
        loading: null,
        step: 'Stages',
        setSteps: this.setSteps,
        toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
        authenticated: this.props.childProps.authenticated,
      };
  }
  editStage = () => {
    return (
      <span>toto</span>
    );
  }
  render() {
    return (
      <Segment className="view" >
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get stage info</Loader>
        </Dimmer>
        <StorySteps step={this.state.step} state={this.state}/>
        <StageSteps step={this.state.step} state={this.state}/>
        {(this.state.ssid >0) ? this.editStage() : ''}
      </Segment>
    );
  }
}
export default stage;
