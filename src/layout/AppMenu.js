import React, { Component } from 'react';
import Auth from '../module/Auth';
import {
  Menu,
  Container,
  Image,
  Dropdown,
  Icon,
} from 'semantic-ui-react';
import Logo from '../logo.svg';
class AppMenu extends Component {
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
    return (
      <Menu fixed='top' inverted color='violet' pointing >
        <Container>
          <Menu.Item as='a' header to='/' href='/'>
            <Image className='App-logo' size='mini' src={Logo} style={{ marginRight: '1.5em' }} />
            Books On Wall
          </Menu.Item>
          {this.state.authenticated ? (
            <Menu.Menu position='right'>
            <Menu.Item to='/dashboard' href='/dashboard' as='a'>Dasboard</Menu.Item>
            <Dropdown item icon='content' simple>
                <Dropdown.Menu className='left'>
                  <Dropdown.Item>
                    <Icon name='add' />
                    <span className='text'>New</span>
                    <Dropdown.Menu>
                      <Dropdown.Item ><Icon name='add' />User</Dropdown.Item>
                      <Dropdown.Item><Icon name='add' />Story</Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown.Item>
                  <Dropdown.Item>
                    <Icon name='list' />
                    <span className='text'>List</span>
                    <Dropdown.Menu>
                      <Dropdown.Item to='/users' href='/users' as='a'><Icon name='list' />Users</Dropdown.Item>
                      <Dropdown.Item><Icon name='list' />Stories</Dropdown.Item>
                    </Dropdown.Menu>
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
