import React, { Component } from 'react';
import {
  Menu,
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
      <Menu fixed className="top" pointing style={{padding: 0}}>
        <Menu.Item name='homepage' active={this.state.activeItem === 'homepage'} as={Link} to='/'  style={{textAlign: 'left'}}>
        <Image className='App-logo'  fluid  src={Logo} style={{ heigt:'100%'  }} />
        </Menu.Item>
        {(!this.props.state.sidebarVisible) ?
        <Menu.Item  className="slide-out">
        <Button className='hamburger' inverted icon circular
            onClick={this.props.state.handleSideBar}
            ><Icon name='bars'  size='big'/></Button>
        </Menu.Item>

      : ''}
      </Menu>
    );
  }
}
export default AppMenu;
