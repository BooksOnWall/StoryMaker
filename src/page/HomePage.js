import React from 'react';
import { Card } from 'semantic-ui-react';
import Auth from '../module/Auth';

class HomePage extends React.Component {

  componentDidMount() {
    // update authenticated state on logout
    this.props.toggleAuthenticateStatus()
  }

  render() {
    return (
      <Card className="container">
        <Card.Content>
        <Card.Header title="Books on Wall" subtitle="This is the home page." />
          {Auth.isUserAuthenticated() ? (
            <Card.Description style={{ fontSize: '16px', color: 'green' }}>Welcome! You are logged in.</Card.Description>
          ) : (
            <Card.Description inverted  style={{ fontSize: '16px',  color: 'red' }}>You are not logged in.</Card.Description>
          )}
          </Card.Content>
      </Card>
    )
  }
};

export default HomePage;
