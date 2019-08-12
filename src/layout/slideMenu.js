import React, {Component} from 'react';
import { Divider,  Image, Icon,  Menu, Segment } from 'semantic-ui-react';
import {Link} from 'react-router-dom';
import UserContext from '../context/UserContext';

class LeftSlideMenu extends Component {
  constructor(props) {
    super(props);
      this.state = {
        activeItem:'homepage'
      }
  }


 handleItemClick = (e, { name }) => this.setState({ activeItem: name })
  render() {
    return (
      <Segment  fluid='true' style={{padding: 0}} >
        <Menu className='bwSidebarMenu'size='large' pointing primary='true' inverted color='violet' vertical fluid  style={{padding: 0}}>
          {this.props.childProps.authenticated ? (
            <UserContext.Consumer>{(user) => {
              return(
                <Menu.Menu style={{padding: 0}}>
                  <Image  avatar size='small' style={{float: 'left'}} src={this.props.state.user.avatar} />
                    <span style={{ fontSize: '2em', color: 'white'}} >Welcome {this.props.state.user.name}</span>
                  <Divider horizontal>...</Divider>
                    <Menu.Item name='homepage' active={this.state.activeItem === 'homepage'} as={Link} to='/'  style={{textAlign: 'left'}}>
                      <Icon name='home' /><span className='text'>Home</span>
                    </Menu.Item>
                    <Menu.Item name='dashboard' active={this.state.activeItem === 'dashboard'} onClick={this.handleItemClick} as={Link} to='/dashboard'  >
                      <Icon name='dashboard' /><span className='text'>Dashboard</span>
                    </Menu.Item>
                      <Divider horizontal>...</Divider>
                    <Menu.Item name='users' active={this.state.activeItem === 'users'} onClick={this.handleItemClick} as={Link} to='/users' className="sidemenu"  >
                      <Icon name='address card'  floated='left'/><span className='text'>Users</span>
                    </Menu.Item>
                    <Menu.Item name='artists' active={this.state.activeItem === 'artists'} onClick={this.handleItemClick} as={Link} to='/artists'  >
                      <Icon name='list' /><span className='text'>Artists</span>
                    </Menu.Item>
                    <Menu.Item name='stories' active={this.state.activeItem === 'stories'} onClick={this.handleItemClick} as={Link} to='/stories'  >
                      <Icon name='list' /><span className='text'>Stories</span>
                    </Menu.Item>

                      <Divider horizontal>...</Divider>
                    <Menu.Item name='logout' active={this.state.activeItem === 'logout'} onClick={this.handleItemClick} as={Link} to='/logout' >
                      <Icon name='joget' /><span className='text'>Logout</span>
                    </Menu.Item>
                </Menu.Menu>
            )}}
          </UserContext.Consumer>
          ) : (
            <Menu.Menu >
              <Menu.Item name='homepage' active={this.state.activeItem === 'homepage'} as={Link} to='/'  style={{textAlign: 'left'}}>
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
