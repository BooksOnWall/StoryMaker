import React, { Component } from 'react';
import Auth from '../module/Auth';
import {
  Container,
  Segment,
} from 'semantic-ui-react';


class Dashboard extends Component {
  componentDidMount() {
    // update authenticated state on logout
    Auth.isUserAuthenticated()
  }
  render() {
    return(
        <Container>
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
