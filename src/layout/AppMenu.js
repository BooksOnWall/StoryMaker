import React, { Component } from 'react';
import {
  Menu,
  Container,
  Image,
  Dropdown,
  Icon,
} from 'semantic-ui-react';
import {Link} from 'react-router-dom';

import Logo from '../logo.svg';
import UserContext from '../context/UserContext';

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
      <Menu fixed='top' fluid inverted color='violet' pointing style={{padding: 0}}>
        <Container fluid>
          <Menu.Item as={Link} header to='/'  style={{fontSize:'1.8vw', padding: 0}}>
            <Image className='App-logo'  fluid  src={Logo} style={{ height: '5vw', width: '5vw',  marginRight: '1.5em' }} />
            Books On Wall
          </Menu.Item>
          {this.props.childProps.authenticated ? (
            <Menu.Menu position='right' style={{padding: 0}}>
              <Image fluid avatar src={this.props.state.user.avatar}
                style={{width:'2vw', height: '2vw',verticalAlign: 'center', marginTop: '0.2em' }}
                />
            <UserContext.Consumer>{(user) => {
              return(
                <Dropdown
                  text= {this.props.state.user.name}
                  style={{fontSize: '1.8vw', color: '#ffffff', verticalAlign: 'center', paddingTop: '0.2em' }}
                >
                    <Dropdown.Menu className='left'>
                      <Dropdown.Item  to='/users'  as={Link}>
                        <Icon name='address card' />
                        <span className='text'>Users</span>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                        <Dropdown.Item to='/artists' as={Link}>
                          <Icon name='list' />
                          <span className='text'>Artists</span>
                        </Dropdown.Item>
                      <Dropdown.Item to='/stories' as={Link}>
                        <Icon name='list' />
                        <span className='text'>Stories</span>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                        <Dropdown.Item  to='/dashboard' as={Link}>
                          <Icon name='dashboard' />
                          <span className='text'>Dashboard</span>
                        </Dropdown.Item>
                      <Dropdown.Item  to='/logout' as={Link}>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )}}
          </UserContext.Consumer>

            </Menu.Menu>
          ) : (
            <Menu.Menu position='right'>
            <Menu.Item to='/login'  as={Link}>Login</Menu.Item>
            <Menu.Item to='/signup' as={Link}>SignUp</Menu.Item>
            </Menu.Menu>
          )}

        </Container>
      </Menu>
    );
  }
}
export default AppMenu;
