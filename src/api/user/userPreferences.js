import React, { Component } from 'react';
import Auth from '../../module/Auth';
import {
  Segment,
  Form,
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
      authenticated: false,
      selected: 'en',
      selected2: 'en',
      lang: null,
      theme: null,
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
  handleSelectChange=(e,{value})=> {
      console.log(value);

      this.setState({value});

  }
  setPreference(e) {
    //  console.log({e.value});
    console.log(this.state);
  }
  render() {
    return (
      <Segment >
        <Form>
        <Dropdown
          name='languagePrefs'
          text='Choose language'
          icon='flag'
          floating
          labeled
          button
          fluid
          selection
          className='icon'
          value={this.state.selected2}
          defaultValue={this.state.selected2}
          onChange={this.handleSelectChange}
          onClick={this.setPreference}
        >
        <Dropdown.Menu>
        <Dropdown.Header content='Select your language' />
        {languages.map(option => (
          <Dropdown.Item  name='lang' key={option.value} {...option} />
        ))}
        </Dropdown.Menu>
        </Dropdown>
        <Divider horizontal>...</Divider>
        <Dropdown
        text='Choose theme'
        icon='theme'
        name='theme'
        floating
        labeled
        button
        fluid
        selection
        className='icon'
        value={this.state.selected}
        defaultValue={this.state.selected}
        onChange={this.handleSelectChange}
        onClick={this.setPreference}
        >
        <Dropdown.Menu>
        <Dropdown.Header content='Select your theme' />
        {themes.map(option => (
          <Dropdown.Item icon={option.flag} key={option.value} {...option} />
        ))}
        </Dropdown.Menu>
      </Dropdown>
      </Form>
    </Segment>
    );
  }
}
export default userPreferences;
