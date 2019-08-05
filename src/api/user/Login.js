import React, { Component } from 'react';
import localForage from "localforage";
import { Formik } from 'formik';
import {
  Grid,
  Button,
  Form,
  Image,
  Header,
  Segment } from "semantic-ui-react";
import Logo from '../../logo.svg';
import Auth from '../../module/Auth';
import { Redirect } from 'react-router-dom';

class Login extends Component {
  constructor(props) {
    super(props);
    // define protocol domain and server url
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
        server : server,
        login: server + 'login',
        register: server + 'register',
        userIsLoggedIn: false,
        userId: null,
        email: null,
        password: null,
        accessToken: null,
        visible: true
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleData = this.handleData.bind(this);
  }
  async storeUserSession(data) {
    try {
      await localForage.config({
        driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
        name: 'userSession',
        storeName: 'user',
        version: 1.0
      });
      await localForage.setItem('email', this.state.email);
      await localForage.setItem('userIsLoggedIn', true);
      await localForage.setItem('accessToken', this.state.accessToken);
      await localForage.setItem('name', data.name);
      await localForage.setItem('uid', data.id);
    } catch(e) {
      console.log(e.message);
    }
  }
  async logUser(data) {
    try {
      await this.setState({accessToken : data.token});
      await Auth.authenticateUser({data}.data);
      await this.setState({userIsLoggedIn: true});
      await this.storeUserSession(data);
      await this.state.setUser();
    } catch(e) {
      console.log(e.message);
    }
    this.props.history.push('/');
  }
  async handleData(values) {
    try {
      this.setState(values);
      await fetch(this.state.login, {
        method: 'post',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body:JSON.stringify({email:this.state.email, password:this.state.password})
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) this.logUser(data);
      })
      .catch((error) => {
        // Your error is here!
        console.log(error)
      });
    } catch(e) {
      alert(e.message);
    }
  }
  handleChange(e) {
    let change = {};
    change[e.target.name] = e.target.value ;
    this.setState(change);
  }

  handleSubmit(e) {
    this.handleData();

  }
  render() {
    if (this.state.isLoggedIn) {
      return <Redirect to={{ pathname: `/dashboard` }} />
    }
    return (
      <Grid  className="view" id="login" textAlign='center' style={{ height: '60vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='orange' textAlign='center'>
            <Image className="App-logo" alt="logo" src={Logo} /> Log-in to your account
          </Header>
            <Segment stacked>
            <Formik
              initialValues={{ email: '', password: '' }}
              validate={values => {
                let errors = {};
                if (!values.email) {
                  errors.email = 'Required';
                } else if (
                  !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
                ) {
                  errors.email = 'Invalid email address';
                }
                return errors;
              }}
              onSubmit={(values, { setSubmitting }) => {
                this.handleData(values);
                setTimeout(() => {
                  //alert(JSON.stringify(values, null, 2));

                  setSubmitting(false);
                }, 400);
              }}
            >
              {({
                values,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                /* and other goodies */
              }) => (
                <Form size='large' onSubmit={this.handleSubmit}>
                  <input
                    icon='user'
                    iconposition='left'
                    placeholder='E-mail address'
                    type="email"
                    name="email"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.email}
                  />
                  {errors.email && touched.email && errors.email}
                  <input
                    icon='lock'
                    iconposition='left'
                    placeholder='Password'
                    type="password"
                    name="password"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password}
                  />
                  {errors.password && touched.password && errors.password}
                  <Button onClick={handleSubmit} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
                    Login
                  </Button>
                </Form>
              )}
            </Formik>
            </Segment>
        </Grid.Column>
      </Grid>
    );
  }
}

export default Login;
