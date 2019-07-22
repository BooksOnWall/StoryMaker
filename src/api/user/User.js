import React, { Component, createRef } from 'react';
import Auth from '../../module/Auth';
import {
  Segment,
  Header,
  Divider,
  Container,
  Form,
  Grid,
  Image,
  Icon,
  Button,
  Card,
  Checkbox,
} from 'semantic-ui-react';
import { Formik } from 'formik';
import UserPref from './userPreferences';
import { Link } from 'react-router-dom';
import Avatar from 'react-avatar-edit';
import Dropzone from 'react-dropzone'
import src from '../../assets/images/patrick.png';

const dropzoneRef = createRef();

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
      uid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
      mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
      user: server + 'users/',
      data: null,
      initialValues: {checked: false},
      authenticated: this.toggleAuthenticateStatus,
      profile: false,
      preview: null,
      src
    };

    this.onCrop = this.onCrop.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onBeforeFileLoad = this.onBeforeFileLoad.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitDelete = this.handleSubmitDelete.bind(this);
    //this.handleData = this.handleData.bind(this);

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
            console.log(data);
            console.log(data.active);
            data.checked = (data.active) ? true : false;
            this.setState({initialValues: data});
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log(error)
      });
    } catch(e) {
      console.log(e.message);
    }
  }

  async updateUser() {
    try {
      await fetch(this.state.user+this.state.uid, {
        method: 'patch',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
        body:JSON.stringify({
          name: this.state.name,
          email:this.state.email,
          password:this.state.password,
          active: this.state.active
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // redirect to users list page
            this.props.history.push('/users');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log(error)
      });
    } catch(e) {
      console.log(e.message);
    }
  }

  async createUser() {
    try {

    } catch(e) {
      console.log(e.message);
    }
  }
  async deleteUser() {
    try {

    } catch(e) {
      console.log(e.message);
    }
  }
  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let change = {};
    change[e.target.name] = value ;
    this.setState(change);
  }

  async handleSubmit(e) {
    let mode = this.state.mode;
    try {
      if (mode ==='create') {
        await this.createUser();
      } else {
        await this.updateUser();
      }
    } catch(e) {
      console.log(e.message);
    }
  }
  async handleSubmitDelete(e) {
    let mode = this.state.mode;
    try {
      if (mode ==='update') {
        await this.deleteUser();
      }
    } catch(e) {
      console.log(e.message);
    }
    this.handleData(this.state.mode);
  }
  async componentDidMount() {
    try {
      await this.toggleAuthenticateStatus();
      if(this.state.mode === 'update')  await this.getUser();

    } catch(e) {
      console.log(e.message);
    }

  }
  onClose() {
    this.setState({preview: null})
  }

  onCrop(preview) {
    this.setState({preview})
  }

  onBeforeFileLoad(elem) {
    //71680
    if(elem.target.files[0].size > 716800){
      alert("File is too big!");
      elem.target.value = "";
    };
  }
  render() {
    // display render only afetr we get initialValues for update mode
    if (this.state.initialValues === null && this.state.mode === 'update') return null;
    let checked = (this.state.mode === 'create') ? false : this.state.initialValues.checked;
    return (
      <Container>
      <Segment>
        <Header as='h6' icon floated='left'>
            <Link to="/users">
              <Icon name='list' />
               List user
            </Link>
        </Header>
        <Grid id="profile" textAlign='center' columns={2} divided verticalAlign='top'>
          <Grid.Row>
          <Grid.Column style={{ maxWidth: 450 }}>
                <Card>

                  <Card.Content>
                    <Card.Header  color='violet'>{(this.state.mode === 'create') ? 'Create new User' : 'Edit User'}</Card.Header>
                  <Avatar
                    width={220}
                    height={220}
                    onCrop={this.onCrop}
                    onClose={this.onClose}
                    onBeforeFileLoad={this.onBeforeFileLoad}
                    src={this.state.src}
                    />
                  <img src={this.state.preview} alt="Preview" />

                  </Card.Content>
                  <Card.Content>
                  <Formik
                    initialValues={this.state.initialValues}
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
                      if(this.state.mode === 'update') {
                        this.updateUser(values);
                      } else {
                        this.createUser(values);
                      }

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
                      handleSubmitDelete,
                      isSubmitting,
                      /* and other goodies */
                    }) => (
                      <Form size='large' onSubmit={this.handleSubmit}>
                        <input
                          icon='user'
                          iconposition='left'
                          placeholder='Name'
                          autoFocus={true}
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
                          {(this.state.mode === 'create') ? (
                          <div>
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
                          <Divider horizontal>...</Divider>
                            <input
                              icon='lock'
                              iconposition='left'
                              placeholder='Repeat Password'
                              type="password"
                              name="password2"
                              onChange={handleChange}
                              onBlur={handleBlur}
                              value={values.password2}
                            />
                        </div>
                          ) : ''}
                        <Divider horizontal>...</Divider>
                        <Checkbox
                          icon='user'
                          iconposition='left'
                          placeholder='Active'
                          ref = "active"
                          label = "Active"
                          name="active"
                          defaultChecked={checked}
                          onChange={handleChange('active')}
                          onBlur={handleBlur}
                          value={(values.active === true) ? 1 : 0 }
                          toggle
                        />
                        {errors.active && touched.active && errors.active}
                        <Divider horizontal>...</Divider>
                        <Button onClick={handleSubmit} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
                          {(this.state.mode === 'create') ? 'Create' : 'Update'}
                        </Button>
                        {(this.state.mode === 'update') ? (
                          <Button onClick={handleSubmitDelete} color='red' fluid size='large' type="submit" disabled={isSubmitting}>
                            Delete
                          </Button>
                        ) : '' }
                      </Form>
                    )}
                  </Formik>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column>
            {(this.state.mode === 'update') ? (
            <Segment>
              <Header as='h3' color='violet' textAlign='center'>
                Change password
              </Header>
              <Formik
                initialValues={this.state.initialValues}
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
                  if(this.state.mode === 'update') {
                    this.updateUserPassword(values);
                  }

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
                  handleSubmitDelete,
                  isSubmitting,
                  /* and other goodies */
                }) => (
                  <Form size='large' onSubmit={this.handleSubmit}>
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
                <Divider horizontal>...</Divider>
                <input
                  icon='lock'
                  iconposition='left'
                  placeholder='Repeat Password'
                  type="password"
                  name="password2"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password2}
                />
                <Divider horizontal>...</Divider>
                <Button onClick={handleSubmit} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
                  {(this.state.mode === 'create') ? 'Create' : 'Update'}
                </Button>
              </Form>
            )}
          </Formik>
            </Segment>
          ) : ''}
            <Segment>
              <Header as='h3' color='violet' textAlign='center'>
                User Preferences
              </Header>
              <UserPref toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
            </Segment>
          </Grid.Column>
          </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
export default User;
