import React, {Component} from 'react';
import { Icon,  Menu, Segment } from 'semantic-ui-react';
import {Link} from 'react-router-dom';

class LeftSlideMenu extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT;
      this.state = {
        activeItem:'homepage',
        server: server,
        activeIndex: null,
        user: this.props.state.user
      }
  }
 handleItemClick = (e, { name }) => this.setState({ activeItem: name })
 handleClick = (e, titleProps) => {
   const { index } = titleProps
   const { activeIndex } = this.state
   const newIndex = activeIndex === index ? -1 : index

   this.setState({ activeIndex: newIndex })
 }

  render() {
    return (
      <Segment  fluid='true' style={{ padding: '0'}} >
        <Menu className='bwSidebarMenu' size='huge' primary='true' inverted vertical fluid style={{padding: 0}}>
          {this.props.childProps.authenticated ? (
            <Menu.Menu style={{ padding: '0'}}>
              <Menu.Item name='dashboard' active={this.state.activeItem === 'dashboard'} onClick={this.handleItemClick} as={Link} to='/dashboard'  >
                <Icon size='large' name='dashboard' /><span className='text'>Dashboard</span>
              </Menu.Item>

              <Menu.Item name='artists' active={this.state.activeItem === 'artists'} onClick={this.handleItemClick} as={Link} to='/artists'  >
                <Icon size='large' name='paint brush' /><span className='text'>Artists</span>
              </Menu.Item>
              <Menu.Item name='stories' active={this.state.activeItem === 'stories'} onClick={this.handleItemClick} as={Link} to='/stories'  >
                <Icon size='large' name='book' /><span className='text'>Stories</span>
              </Menu.Item>
              <Menu.Item name='stats' active={this.state.activeItem === 'stats'} onClick={this.handleItemClick} as={Link} to='/stats'  >
                <Icon size='large' name='chart' /><span className='text'>Stats</span>
              </Menu.Item>
              <Menu.Item name='logout' className='logout' active={this.state.activeItem === 'logout'} onClick={this.handleItemClick} as={Link} to='/logout' >
                <Icon name='log out' /><span className='text'>Logout</span>
              </Menu.Item>
            </Menu.Menu>
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
