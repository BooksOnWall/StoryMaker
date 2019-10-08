import React, { Component } from 'react';
import {
  Menu,
  Image,
  Icon,
  Button,
  Divider,
} from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import UserContext from '../context/UserContext';

import Logo from '../logo.svg';

class AppMenu extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT;
    this.state = {
      locales: this.props.state.locales,
      users: this.props.state.users,
      themes: this.props.state.themes,
      theme: this.props.state.theme,
      server: server,
      user: this.props.state.user,
      locale: this.props.state.locale,
      authenticated: this.props.childProps.authenticated,
    }
  }

  render() {
    return (
      <Menu  className="top" pointing style={{padding: 0}}>
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
        <Divider as={Menu.Item} inverted className='push-down'  />
      {this.props.childProps.authenticated ? (
        <UserContext.Consumer>{(user) => {
          return(
            <Menu.Item name='users' active={this.state.activeItem === 'users'} onClick={this.handleItemClick} as={Link} to='/users' className="userBar"  >
              <Image  avatar  src={this.state.server + this.props.childProps.user.avatar} />
            </Menu.Item>
          )}}
        </UserContext.Consumer>
      ) : ''}
      </Menu>
    );
  }
}
export default AppMenu;
