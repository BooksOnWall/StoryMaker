import React, { Component } from 'react';
import {
  Segment,
  Divider,
  Dimmer,
  Loader,
  Dropdown,
    Header,
} from 'semantic-ui-react';
import { themes } from '../../theme/globalStyle';
import { locales } from '../../i18n/locales/globalLocales';
import ThemeContext from '../../context/ThemeContext';
import LocaleContext from '../../context/LocaleContext';

import _ from 'lodash';

import { injectIntl, FormattedMessage } from 'react-intl';

const ThemeOptions = Object.values(themes);
const LocaleOptions = Object.values(locales.locale.languages);

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
      toggleAuthenticateStatus: this.props.state.toggleAuthenticateStatus,
      authenticated: this.props.state.authenticated,
      loading: false,
      pref: null,
      locale: {value: this.props.state.locale},
      theme: {value: this.props.state.theme},
      setTheme: this.props.state.setTheme,
      setLocale: this.props.state.setLocale,
      avatar: (this.props.state.user.avatar) ? this.props.state.user.avatar : null,
    };
    this.setPreference = this.setPreference.bind(this);
  };

  async componentDidMount() {
    try  {
      // check if user is logged in on refresh
      await this.state.toggleAuthenticateStatus;
      //get user preferences
      await this.getPreferences;
    } catch(e) {
      console.log(e.message);
    }
    //console.log(this.state);
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
              let h = [];
              _.map(data, ({ id, pname, pvalue }) => {
                h[pname]= pvalue;
              });
              this.props.state.setUserPreferences(h);
            }
            this.setState({loading: false});
            return
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
      this.setState({ [pref]: value });
      if(pref === 'locale') this.state.setLocale(value);
      if(pref === 'theme') this.state.setTheme(value);

      let uid = this.props.id;
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
    return (
      <Segment inverted className='slide-in'>
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >
            <FormattedMessage id="app.userPrefs.loading" defaultMessage={`Get users preferences`}/>
          </Loader>
        </Dimmer>
        <ThemeContext.Consumer>
          {({theme, setTheme}) => (
            <div>
              <Header inverted as='h3' primary>
              <FormattedMessage id="app.user.theme" defaultMessage={`Choose your theme`}/>   </Header>         
            <Dropdown
             inverted
               fluid
               name='theme'
               pref='theme'
                button
                className='icon'
                floating
                labeled
                icon='paint brush'
                search
               onChange={this.setPreference}
               options={ThemeOptions}
               defaultValue={this.props.state.user.theme}
             />
           </div>
          )}
        </ThemeContext.Consumer>

          <Divider/>
            <LocaleContext.Consumer>
              {({locale, setLocale}) => (
                <div>
                  <Header inverted as='h3' primary>
                  <FormattedMessage id="app.user.locale" defaultMessage={`Choose your Language`}/>   </Header>             
                <Dropdown
                   fluid
                   pref='locale'
                   name='locale'                  
                    button
                    className='icon'
                    floating
                    labeled
                    icon='world'
                    search      
                   onChange={this.setPreference}
                   options={LocaleOptions}
                   defaultValue={this.props.state.user.locale}
                 />
               </div>
              )}
            </LocaleContext.Consumer>


       </Segment>
    );
  }
}
export default injectIntl(userPreferences);
