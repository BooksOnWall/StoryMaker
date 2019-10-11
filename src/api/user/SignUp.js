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
import {  FormattedMessage } from 'react-intl';

class SignUp extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';

    this.state = {
      server : server,
      login: server + 'login',
      register: server + 'register',
      userIsLoggedIn: false,
      userId: null,
      name: null,
      email: null,
      password: null,
      password2: null,
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

    fetch(this.state.register, {
      method: 'post',
      headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
      body:JSON.stringify({name: this.state.name, email:this.state.email, password:this.state.password})
    })
    .then(response => {
      if (response && !response.ok) { throw new Error(response.statusText);}
      return response.json();
    })
    .then(data => {
        if(data) {
          this.setState(data);
          this.setState({userIsLoggedIn: true});
          // store this.state en localstorage
          this.storeUserSession();
          this.props.history.push("/dashboard");
        }
    })
    .catch((error) => {
      // Your error is here!
      //console.log(error)
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
      <Grid  className="view" id="signup" textAlign='center' style={{ height: '60vh' }} verticalAlign='middle'>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='orange' textAlign='center'>
            <Image className="App-logo" alt="logo" src={Logo} />                    <FormattedMessage id="app.user.singup.youraccount" defaultMessage={` Sign Up to your account`}/>
          </Header>
            <Segment stacked>
            <Formik
              initialValues={{ name: '', email: '', password: '', password2: '' }}
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
                    placeholder='User name'
                    type="text"
                    name="name"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.name}
                  />
                  {errors.name && touched.name && errors.name}
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
                  <input
                    icon='lock'
                    iconposition='left'
                    placeholder='Repeat password'
                    type="password"
                    name="password2"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={values.password2}
                  />
                  {errors.password2 && touched.password2 && errors.password2}
                  <Button onClick={handleSubmit} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
                    <FormattedMessage id="app.user.singup" defaultMessage={`Login`}/>
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


SignUp.propTypes = {
  //onSubmit: PropTypes.func.isRequired,
  //onChange: PropTypes.func.isRequired,
  //errors: PropTypes.object.isRequired,
  //user: PropTypes.object.isRequired
};

export default SignUp;
