import React, { Component } from 'react';
import Auth from '../../module/Auth';
import {
  Segment,
  Header,
  Divider,
  Container,
  Form,
  Image,
  Grid,
  Icon,
  Button,
  Checkbox,
} from 'semantic-ui-react';
import { Formik } from 'formik';
import Logo from '../../logo.svg';
import UserPref from './userPreferences';
import { Link } from 'react-router-dom';

class User extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      server: server,
      login: server + 'login',
      register: server + 'register',
      users: server + 'users',
      uid: (!this.props.match.params.id) ? (0) : (this.props.match.params.id),
      user: server + 'users/',
      data: null,
      authenticated: this.toggleAuthenticateStatus,
      profile: false,
    };
    this.toggleAuthenticateStatus = this.toggleAuthenticateStatus.bind(this);
  }
  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  async getUser() {
    try {
      await fetch(this.state.user+this.state.uid, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({data: data});
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        //console.log(error)
      });
    } catch(e) {
      console.log(e.message);
    }
  }
  async componentDidMount() {
    try {
      await this.toggleAuthenticateStatus();
      await this.getUser();
    } catch(e) {
      console.log(e.message);
    }

  }
  render() {
    let uid = this.props.match.params.id;
    console.log(this.props.match.params.id);
    return (
      <Container>
      <Segment>
        <Header as='h5' icon floated='left'>
            <Link to="/users">
              <Icon name='list' />
               List user
            </Link>
        </Header>
        <Grid id="profile" textAlign='center' columns={2} divided verticalAlign='top'>
          <Grid.Row>
          <Grid.Column style={{ maxWidth: 450 }}>
            <Header as='h2' color='orange' textAlign='center'>
              <Image className="App-logo" alt="logo" src={Logo} />My Profile
            </Header>
              <Segment stacked>
              <Formik
                initialValues={{ name: '', email: '', password: '' }}
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
                      placeholder='Name'
                      type="text"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.name}
                    />
                    {errors.name && touched.name && errors.name}
                    <Divider horizontal>...</Divider>
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
                    <Divider horizontal>...</Divider>
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
                    <Divider horizontal>...</Divider>
                    <Checkbox
                      icon='user'
                      iconposition='left'
                      placeholder='Active'
                      ref = "active"
                      label = "Active"
                      name="active"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      value={values.active}
                      toggle
                    />
                    {errors.active && touched.active && errors.active}
                    <Divider horizontal>...</Divider>
                    <Button onClick={handleSubmit} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
                      Update
                    </Button>
                    <Divider horizontal>...</Divider>
                    <Button onClick={handleSubmit} color='red' fluid size='large' type="submit" disabled={isSubmitting}>
                      Delete
                    </Button>
                  </Form>
                )}
              </Formik>
              </Segment>
          </Grid.Column>
          <Grid.Column>
            <Header as='h2' color='orange' textAlign='center'>
              <Image className="App-logo" alt="logo" src={Logo} />User Preferences
            </Header>
            <UserPref toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
          </Grid.Column>
          </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
export default User;
