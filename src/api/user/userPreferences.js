import React, { Component } from 'react';
import Auth from '../../module/Auth';
import {
  Segment,
  Divider,
  Dropdown,
} from 'semantic-ui-react';

const languages = [
  {
    key: 'En',
    text: 'English',
    value: 'en',
    flag: 'us',
  },
  {
    key: 'Es',
    text: 'Espagnol',
    value: 'es',
    flag: 'es',
  },
  {
    key: 'Pt',
    text: 'Portuguese',
    value: 'pt',
    flag: 'br',
  },
];

const themes = [
  {
    key: 'Dark',
    text: 'Dark Theme',
    value: 'dark',
    image: { avatar: true, src: '/images/avatar/small/jenny.jpg' },
  },
  {
    key: 'Light',
    text: 'Light theme',
    value: 'light',
    image: { avatar: true, src: '/images/avatar/small/elliot.jpg' },
  }
]

class userPreferences extends Component {
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
      <Segment stacked>
        <Dropdown
          text='Choose language'
          icon='flag'
          floating
          labeled
          button
          className='icon'
        >
        <Dropdown.Menu>
        <Dropdown.Header content='Select your language' />
        {languages.map(option => (
          <Dropdown.Item key={option.value} {...option} />
        ))}
        </Dropdown.Menu>
        </Dropdown>
        <Divider horizontal>...</Divider>
        <Dropdown
        text='Choose theme'
        icon='theme'
        floating
        labeled
        button
        className='icon'
        >
        <Dropdown.Menu>
        <Dropdown.Header content='Select your theme' />
        {themes.map(option => (
          <Dropdown.Item icon={option.flag} key={option.value} {...option} />
        ))}
        </Dropdown.Menu>
      </Dropdown>
    </Segment>
    );
  }
}
export default userPreferences;
