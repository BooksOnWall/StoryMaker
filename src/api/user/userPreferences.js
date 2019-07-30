import React, { Component } from 'react';
import Auth from '../../module/Auth';
import {
  Segment,
  Form,
  Label,
  Divider,
  Dropdown,
} from 'semantic-ui-react';
import { injectIntl, FormattedMessage } from 'react-intl';

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
      uid: this.props.match.params.id,
      selected: 'en',
      selected2: 'en',
      pref: null,
      locale: 'en',
      theme: 'light',
    }
    this.setPreference = this.setPreference.bind(this);
  };
  async componentDidMount() {
    // check if user is logged in on refresh
    await this.toggleAuthenticateStatus();
    await this.getPreferences();
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  handleSelectChange=(e,{active,text,value})=> {
      (!active) ? this.setState({locale: value}) : this.setState({locale: 'en'});

  }
  async getPreferences() {


  }
  async setPreference(e,{pref,value}) {
      this.setState({pref: pref});
      console.log(pref);
      console.log(value);
      try {
        await fetch(this.state.user+this.state.uid+'/prefs', {
          method: 'PATCH',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
          body:JSON.stringify({
            uid: this.state.ui,
            pref: pref,
            value: value,
          })
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              // redirect to users list page
              this.props.history.push('/users/' + this.state.uid);
            }
        })
        .catch((error) => {
          // Your error is here!
          console.log(error)
        });
      } catch(e) {
        console.log(e.message);
    }
    //console.log(this.state.locale);
  }
  render() {
    return (
      <Segment >
        <Label><FormattedMessage id="app.user.theme" defaultMessage={`Choose your theme`}/></Label>
        <Dropdown
           fluid
           pref='theme'
           selection
           simple
           item
           onChange={this.setPreference}
           onClick={this.setPreference}
           options={themes}
           defaultValue={this.state.theme}
         />
          <Divider horizontal>...</Divider>
          <Label><FormattedMessage id="app.user.locale" defaultMessage={`Choose your Language`}/></Label>
          <Dropdown
             fluid
             pref='locale'
             selection
             simple
             item
             defaultValue={this.state.locale}
             onChange={this.setPreferences}
             options={languages}
           />

    </Segment>
    );
  }
}
export default injectIntl(userPreferences);
