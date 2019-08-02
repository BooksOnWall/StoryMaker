import React, { Component } from 'react';
import Auth from '../module/Auth';
import {
  Container,
  Segment,
} from 'semantic-ui-react';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false
    }
  };
  componentDidMount() {
    // check if user is logged in on refresh
    this.toggleAuthenticateStatus()
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  render() {
    return(
      <Container className="view">
        <Segment.Group>
          <Segment>Content1</Segment>
          <Segment>Content2</Segment>
          <Segment>Content3</Segment>
          <Segment>Content4</Segment>
        </Segment.Group>
      </Container>
    );
  }
}

export default Dashboard;
