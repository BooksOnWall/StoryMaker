import React, { Component } from 'react';
import { Card } from 'semantic-ui-react';
import Auth from '../module/Auth';
import { injectIntl, FormattedMessage } from 'react-intl';
import styled, { keyframes } from "styled-components";
import { TransitionGroup, CSSTransition } from "react-transition-group";
import PageElm from './animPage';

class HomePage extends Component {

  componentDidMount() {
    // update authenticated state on logout
    this.props.toggleAuthenticateStatus()
  }

  render() {
    return (
      <PageElm style={{ marginTop: '46px'}}>
      <Card className="container">
        <Card.Content>
        <Card.Header
            title=<FormattedMessage id="app.home.title" defaultMessage={`Books on Wall`}/>
            subtitle=<FormattedMessage id="app.home.subtitle" defaultMessage={`This is the home page.`}/>
        />
          {Auth.isUserAuthenticated() ? (
            <Card.Description
              style={{ fontSize: '16px', color: 'green' }}>
              <FormattedMessage
                id="app.home.logged"
                defaultMessage={`You are  logged in.!`}
              />
            </Card.Description>
          ) : (
            <Card.Description
              style={{ fontSize: '16px',  color: 'red' }}>
                <FormattedMessage
                  id="app.home.unlogged"
                  defaultMessage={`You are not logged in.!`}
                />
            </Card.Description>
          )}
          </Card.Content>
      </Card>
      </PageElm>
    )
  }
};

export default injectIntl(HomePage);
