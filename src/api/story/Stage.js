import React, { Component } from 'react';

import {
  Segment,
  Header,
  Divider,
  Container,
  Checkbox,
  Form,
  Input,
  Select,
  Label,
  Icon,
  Button,
  Confirm,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import StorySteps from './storySteps';
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
        ssid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
        mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
        name: null,
        stages: '/stories/' + this.props.match.params.id + '/stages',
        map:  '/stories/' + this.props.match.params.id + '/map',
        loading: null,
        step: 'Story',
        setSteps: this.setSteps,
        toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
        authenticated: this.props.childProps.authenticated,
      };

  }
  render() {
    return (
      <span>stage</span>
    );
  }
}
export default stage;
