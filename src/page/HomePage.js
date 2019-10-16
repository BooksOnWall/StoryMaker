import React, { Component } from 'react';
import { Container, Card, Segment, Header } from 'semantic-ui-react';
import Auth from '../module/Auth';
import { injectIntl, FormattedMessage } from 'react-intl';


class HomePage extends Component {

  componentDidMount() {
    // update authenticated state on logout
    this.props.toggleAuthenticateStatus()
  }

  render() {
    return (
      <Container fluid className="main">
      <Segment inverted className="view" fluid>
      <Segment inverted>
        <Header as='h1' textAlign='center'
            title=<FormattedMessage id="app.home.title" defaultMessage={`Books on Wall`}/>
            subtitle=<FormattedMessage id="app.home.subtitle" defaultMessage={`This is the home page.`}/>
        />
          {Auth.isUserAuthenticated() ? (
            <Header as='h1' textAlign='center'
              style={{ fontSize: '16px', color: 'green' }}>
              <FormattedMessage
                id="app.home.logged"
                defaultMessage={`You are  logged in!`}
              />
            </Header>
          ) : (
            <Header as='h1' textAlign='center'
              style={{ fontSize: '16px',  color: 'brown' }}>
                <FormattedMessage
                  id="app.home.unlogged"
                  defaultMessage={`You are not logged in!`}
                />
            </Header>
          )}
      </Segment>
    </Segment>
    </Container>
    )
  }
};

export default injectIntl(HomePage);
