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
  setUser(e){
     let user = e.target.value;
      this.setState({
         user:user
      });
  //    user.state.user = user;
      console.log(user);
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
              <Image avatar src={this.props.state.user.avatar}
                style={{verticalAlign: 'center', marginTop: '0.2em' }}
                />
            <UserContext.Consumer>{(user) => {
              return(
                <Dropdown
                  text= {this.props.state.user.name}
                  style={{color: '#ffffff', verticalAlign: 'center', paddingTop: '0.2em' }}
                >
                    <Dropdown.Menu className='left'>
                      <Dropdown.Item  to='/users' href='/users' as='a'>
                        <Icon name='address card' />
                        <span className='text'>Users</span>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                        <Dropdown.Item to='/artists' href='/artists' as='a'>
                          <Icon name='list' />
                          <span className='text'>Artists</span>
                        </Dropdown.Item>
                      <Dropdown.Item to='/stories' href='/stories' as='a'>
                        <Icon name='list' />
                        <span className='text'>Stories</span>
                      </Dropdown.Item>
                      <Dropdown.Divider />
                        <Dropdown.Item  to='/dashboard' href='/dashboard' as='a'>
                          <Icon name='dashboard' />
                          <span className='text'>Dashboard</span>
                        </Dropdown.Item>
                      <Dropdown.Item  to='/logout' href='/logout' as='a'>Logout</Dropdown.Item>
                    </Dropdown.Menu>
                </Dropdown>
            )}}
          </UserContext.Consumer>

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
