import React, {Component} from 'react';
import { Divider,  Image, Icon,  Menu, Segment } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import UserContext from '../context/UserContext';
import Logo from '../logo.svg';

class LeftSlideMenu extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT;
      this.state = {
        activeItem:'homepage',
        server: server,
        user: this.props.state.user
      }
  }
 handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    return (
      <Segment  fluid='true' style={{ padding: '0'}} >
        <Menu className='bwSidebarMenu' size='huge' primary='true' inverted color='black' vertical fluid  style={{padding: 0}}>
          {this.props.childProps.authenticated ? (
            <UserContext.Consumer>{(user) => {
              return(
                <Menu.Menu style={{ padding: '0'}}>
                    <Menu.Item name='homepage' active={this.state.activeItem === 'homepage'} as={Link} to='/'  style={{textAlign: 'left'}}>
                    <Image className='App-logo'  fluid  src={Logo} style={{ height: '6vh', marginLeft: '-2.5em'}} />                  
                    </Menu.Item>
                    <Menu.Item name='dashboard' active={this.state.activeItem === 'dashboard'} onClick={this.handleItemClick} as={Link} to='/dashboard'  >
                      <Icon size='large' name='dashboard' /><span className='text'>Dashboard</span>
                    </Menu.Item>
                      <Divider horizonta />

                    <Menu.Item name='artists' active={this.state.activeItem === 'artists'} onClick={this.handleItemClick} as={Link} to='/artists'  >
                      <Icon size='large' name='paint brush' /><span className='text'>Artists</span>
                    </Menu.Item>
                    <Menu.Item name='stories' active={this.state.activeItem === 'stories'} onClick={this.handleItemClick} as={Link} to='/stories'  >
                      <Icon size='large' name='book' /><span className='text'>Stories</span>
                    </Menu.Item>

                      <Divider horizonta />
                  
                    <Menu.Item name='users' active={this.state.activeItem === 'users'} onClick={this.handleItemClick} as={Link} to='/users' className="sidemenu"  >
                      <Image  avatar size='tinny' src={this.state.server + this.props.childProps.user.avatar} /><span className='text'>Users</span>
                   </Menu.Item>
                    <Menu.Item name='logout' className='logout' active={this.state.activeItem === 'logout'} onClick={this.handleItemClick} as={Link} to='/logout' >
                      <Icon name='log out' /><span className='text'>Logout</span>
                    </Menu.Item>                  
                </Menu.Menu>
            )}}
          </UserContext.Consumer>
          ) : (
            <Menu.Menu >
              <Menu.Item name='homepage' active={this.state.activeItem === 'homepage'} as={Link} to='/'  >
                <Icon name='home' /><span className='text'>Home</span>
              </Menu.Item>
            <Menu.Item active={this.state.activeItem === 'login'} onClick={this.handleItemClick} to='/login'  as={Link}><Icon name='connectdevelop' /><span className='text'>Login</span></Menu.Item>
            <Menu.Item active={this.state.activeItem === 'signup'} onClick={this.handleItemClick} to='/signup' as={Link}><Icon name='connectdevelop' /><span className='text'>SignUp</span></Menu.Item>
            </Menu.Menu>
          )}
        </Menu>
      </Segment>
    );
  }
}

export default LeftSlideMenu;
