import React, { Component } from 'react';
import {
  Menu,
  Container,
  Image,
  Dropdown,
  Icon,
} from 'semantic-ui-react';


//import image
import Logo from '../logo.svg';
import Avatar from '../assets/images/patrick.png';


class AppMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: this.props.childProps.authenticated,
    }
  }
  render() {
    return (
      <Menu fixed='top' inverted color='violet' pointing >
        <Container>
          <Menu.Item as='a' header to='/' href='/'>
            <Image className='App-logo' size='mini' src={Logo} style={{ marginRight: '1.5em' }} />
            Books On Wall
          </Menu.Item>
          {this.props.childProps.authenticated ? (
            <Menu.Menu position='right'>
            <Menu.Item to='/dashboard' href='/dashboard' as='a'>Dasboard</Menu.Item>
            <Dropdown  icon='user' color='orange' className='icon'
              image = {{ avatar: true, src: Avatar }}
              text='Tom'
              style={{verticalAlign: 'center', paddingTop: '1.2em' }}
            > 
                <Dropdown.Menu className='left'>
                  <Dropdown.Item  to='/users' href='/users' as='a'>
                    <Icon name='address card' />
                    <span className='text'>Users</span>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item to='/stories' href='/stories' as='a'>
                    <Icon name='list' />
                    <span className='text'>Stories</span>
                  </Dropdown.Item>
                  <Dropdown.Divider />
                    <Dropdown.Item  to='/profile' href='/profile' as='a'>Profile</Dropdown.Item>
                  <Dropdown.Item  to='/logout' href='/logout' as='a'>Logout</Dropdown.Item>
                </Dropdown.Menu>
            </Dropdown>
            </Menu.Menu>
          ) : (
            <Menu.Menu position='right'>
            <Menu.Item to='/login' href='/login' as='a'>Login</Menu.Item>
            <Menu.Item to='/signup' href='/signup' as='a'>SignUp</Menu.Item>
            </Menu.Menu>
          )}
        </Container>
      </Menu>
    );
  }
}
export default AppMenu;
