import React, { Component } from 'react';
import {
  Menu,
  Container,
  Image,
  Icon,
  Button
} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

import Logo from '../logo.svg';

class AppMenu extends Component {
  constructor(props) {
    super(props);

    this.state = {
      locales: this.props.state.locales,
      users: this.props.state.users,
      themes: this.props.state.themes,
      theme: this.props.state.theme,
      user: this.props.state.user,
      locale: this.props.state.locale,
      authenticated: this.props.childProps.authenticated,
    }
  }

  render() {
    return (
      <Menu fixed='top'  inverted color='violet' pointing style={{padding: 0}}>
        <Container fluid >
          <Button primary
            onClick={this.props.state.handleSideBar}
            ><Icon name='sliders'/></Button>
          <Menu.Item as={Link} header to='/'  style={{fontSize:'1.8em', padding: 0}}>
            <Image className='App-logo'  fluid  src={Logo} style={{ height: '5vw', width: '5vw',  marginRight: '1.5em' }} />
            Books On Wall
          </Menu.Item>
        </Container>
      </Menu>
    );
  }
}
export default AppMenu;
