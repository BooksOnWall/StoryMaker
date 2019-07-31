import React, { Component } from 'react';
import Auth from '../../module/Auth';
import {
  Segment,
  Label,
  Divider,
  Dimmer,
  Loader,
  Dropdown,
} from 'semantic-ui-react';

import _ from 'lodash';

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
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    let uid = this.props.id;
    let users = server + 'users';
    let userPreferences = users + '/' + uid + '/prefs';
    this.state = {
      server: server,
      uid: uid,
      users: users,
      userPreferences : userPreferences,
      authenticated: false,
      loading: false,
      pref: null,
      locale: {value: 'en'},
      theme: {value: 'light'},
      avatar: null,
    };
    this.setPreference = this.setPreference.bind(this);
  };

  async componentDidMount() {
    try  {
      // check if user is logged in on refresh
      await this.toggleAuthenticateStatus();
      //get user preferences
      await this.getPreferences;
      console.log(this.state);
    } catch(e) {
      console.log(e.message);
    }
    //console.log(this.state);
  }
  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  async getPreferences() {
      this.setState({loading: true});
      try {
        await fetch(this.state.userPreferences , {
          method: 'get',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' }
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data && data.length > 0) {
              _.map(data, ({ id, pname, pvalue }) => {
                pvalue= JSON.parse(pvalue);
                this.setState({ [pname]: pvalue});
              });
            }
            this.setState({loading: false});
            return data
        })
        .catch((error) => {
          // Your error is here!
          console.log(error)
        });
      } catch(e) {
        console.log(e.message);
      }
  }
  async setPreference(e,{pref,value}) {
      this.setState({pref: pref});
      this.setState({ [pref]: {value: value} });
      let uid = this.state.uid;
      try {
        await fetch(this.state.userPreferences , {
          method: 'PATCH',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
          body:JSON.stringify({
            uid: uid,
            pref: pref,
            pvalue: value,
          })
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              // redirect to users list page
              console.log(this.state);
              //this.props.history.push('/users/' + this.state.uid);
              return data
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
    if (this.state.theme.value === null && this.state.locale.value === null) return null;
    console.log(this.state.locale.value);
    return (
      <Segment >
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >
            <FormattedMessage id="app.userPrefs.loading" defaultMessage={`Get users preferences`}/>
          </Loader>
        </Dimmer>
        <Label><FormattedMessage id="app.user.theme" defaultMessage={`Choose your theme`}/></Label>
        <Dropdown
           fluid
           name='theme'
           pref='theme'
           selection
           simple
           item
           onChange={this.setPreference}
           options={themes}
           defaultValue={this.state.theme.value}
         />
          <Divider horizontal>...</Divider>
          <Label><FormattedMessage id="app.user.locale" defaultMessage={`Choose your Language`}/></Label>
          <Dropdown
             fluid
             pref='locale'
             name='locale'
             selection
             simple
             item
             onChange={this.setPreference}
             options={languages}
             defaultValue={this.state.locale.value}
           />

    </Segment>
    );
  }
}
export default injectIntl(userPreferences);
