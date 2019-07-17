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


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
        server : 'http://localhost:3010/users',
        login: 'http://localhost:3010/login',
        register: 'http://localhost:3010/register',
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
  storeUserSession = async () => {
    localForage.config({
      driver: [localForage.INDEXEDDB, localForage.LOCALSTORAGE],
      name: 'userSession',
      storeName: 'user',
      version: 1.0
    });
    localForage.setItem('email', this.state.email);
    localForage.setItem('password', this.state.password);
    localForage.setItem('userIsLoggedIn', this.state.userIsLoggedIn);
    localForage.setItem('accessToken', this.state.accessToken);
  }
  handleData(values) {
    this.setState(values);
    fetch(this.state.login, {
      method: 'post',
      headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
      body:JSON.stringify({email:this.state.email, password:this.state.password})
    })
    .then(response => {
      if (response && !response.ok) { throw new Error(response.statusText);}
      return response.json();
    })
    .then(data => {
        if(data) {
          console.log(data);
          this.setState({accessToken : data.token});
          Auth.authenticateUser(data.token);
          this.setState({userIsLoggedIn: true});
          // store this.state en localstorage
          this.storeUserSession();
          this.props.history.push("/dashboard");
        }
    })
    .catch((error) => {
      // Your error is here!
      console.log(error)
    });
  }
  handleChange(e) {
    let change = {};
    change[e.target.name] = e.target.value ;
    this.setState(change);
  }

  handleSubmit(e) {
    this.handleData();

  }
  componentDidMount() {
    this.timeout = setTimeout(() => this.setState({ visible: false }), 3000);
  }
  clearTimeouts() {
    this.timeouts.forEach(clearTimeout);
   }
  componentWillUnmount() {
    if (this.timeout) {
      clearTimeout(this.timeout)
    }
  }
  render() {
    return (
      <Grid id="login" textAlign='center' style={{ height: '60vh' }} verticalAlign='middle'>
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
