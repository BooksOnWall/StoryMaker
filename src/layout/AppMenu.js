import React, { Component } from 'react';
import {
  Menu,
  Image,
  Icon,
  Button
} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

import Logo from '../logo2.svg';

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
      <Menu fixed='top'  inverted color='black' pointing style={{padding: 0}}>
          <Button secondary
            onClick={this.props.state.handleSideBar}
            ><Icon circular name='bars' size='big'/></Button>
          <Menu.Item as={Link} header to='/'  style={{padding: 0}}>
            <Image className='App-logo'  fluid  src={Logo} style={{ height: '4vw', width: '12vw',  marginRight: '1.5em', marginLeft: '.5em' }} />
          </Menu.Item>
      </Menu>
    );
  }
}
export default AppMenu;
