import React, { Component } from 'react';
import Auth from '../../module/Auth';

import {
  Segment,
  Header,
  Divider,
  Container,
  Form,
  Grid,
  Icon,
  Button,
  Card,
  Checkbox,
  Confirm,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import { Formik } from 'formik';
import UserPref from './userPreferences';
import UserAvatar from './userAvatar';
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
      uid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
      mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
      name: null,
      loading: null,
      checked: false,
      active: false,
      user: server + 'users/',
      userPref: server + 'userPref/',
      data: null,
      userPrefs: {},
      initialValues: { name: '', email: '', password: '', password2: '', active: 0, checked: false },
      authenticated: this.toggleAuthenticateStatus,
      open: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    //this.handleData = this.handleData.bind(this);

    this.toggleAuthenticateStatus = this.toggleAuthenticateStatus.bind(this);
  }
  // toggle user active slider
  toggle = () => this.setState( prevState => ({ checked: !prevState.checked }))
  // confirm functions for user delete
  show = () => this.setState({ open: true })
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })

  toggleAuthenticateStatus() {
  // check authenticated status and toggle state based on that
  this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  async getUserPref() {
    try {
      await fetch(this.state.userPref+this.state.uid, {
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
            // removed unwanted password hash
            delete data.password;

            data.checked = data.active;
            this.setState({uid: data.id, name: data.name});
            this.setState({userPrefs: data});
            this.setState({loading: false});
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
  async getUser() {
    // set loading
    this.setState({loading: true});
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
            // removed unwanted password hash
            delete data.password;

            data.checked = data.active;
            this.setState({uid: data.id, name: data.name});
            this.setState({initialValues: data});
            this.setState({loading: false});
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

  async updateUser(values) {
    console.log(values.name)
    try {
      await fetch(this.state.user+this.state.uid, {
        method: 'PATCH',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
        body:JSON.stringify({
          name: values.name,
          email:values.email,
          password:values.password,
          active: values.active
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

  async createUser(values) {
    this.setState(values);
    try {
      await fetch(this.state.user+0, {
        method: 'post',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
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
            // redirect to user edit page
            this.setState({uid: data.user.id })
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
  async deleteUser() {
    try {
        await fetch(this.state.user + this.state.uid, {
        method: 'delete',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body:JSON.stringify({ id: this.state.uid })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // redirect to user edit page
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
  handleChange(e) {
    console.log(e.target);
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let change = {};
    change[e.target.name] = value ;
    this.setState({initialValues: change});
    console.log(this.state.initialValues.checked)
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
  async handleDelete(e) {
    e.preventDefault(); // Let's stop this event.

    let mode = this.state.mode;
    try {
      if (mode ==='update') {
        await this.deleteUser();
      }
    } catch(e) {
      console.log(e.message);
    }
  }
  async componentDidMount() {
    try {
      await this.toggleAuthenticateStatus();
      if(this.state.mode === 'update')  await this.getUser();

    } catch(e) {
      console.log(e.message);
    }
  }

  render() {
    // display render only afetr we get initialValues for update mode
    if (this.state.initialValues === null && this.state.mode === 'update') return null;
    return (
      <Container>
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get user info</Loader>
        </Dimmer>
      <Segment>
        <Header as='h6' icon floated='left'>
            <Link to="/users">
              <Icon name='list' />
               List user
            </Link>
        </Header>
        <Grid id="profile" textAlign='left' columns={3} divided verticalAlign='top'>
          <Grid.Row>
            <Grid.Column>
              <Header as='h3' color='violet' textAlign='center'>
                {(this.state.mode === 'create') ? 'Create new User' : 'Edit user'}
              </Header>
              <Card>
                <Card.Content>
                  <Formik
                    enableReinitialize={true}
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
                      handleDelete,
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
                          defaultChecked= {this.state.initialValues.checked}
                          onChange = {(e, { checked }) => handleChange(checked)}
                          onBlur = {handleBlur}
                          value={(values.active === true) ? 1 : 0 }
                          toggle
                        />
                        {errors.active && touched.active && errors.active}
                        <Divider horizontal>...</Divider>
                        <Button onClick={handleSubmit} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
                          {(this.state.mode === 'create') ? 'Create' : 'Update'}
                        </Button>
                        {(this.state.mode === 'update') ? (
                          <div>
                            <Button onClick={this.show} color='red' fluid size='large' type="submit" disabled={isSubmitting}>
                              Delete
                            </Button>
                            <Confirm

                               open={this.state.open}
                               cancelButton='Never mind'
                               confirmButton="Delete User"
                               onCancel={this.handleCancel}
                               onConfirm={this.handleDelete}
                             />
                          </div>
                        ) : '' }
                      </Form>
                    )}
                  </Formik>
              </Card.Content>
            </Card>
          </Grid.Column>
          {(this.state.mode === 'update') ? (
            <Grid.Column>
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
              <Segment>
                <Header as='h3' color='violet' textAlign='center'>
                  User Preferences
                </Header>
                <UserPref toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
              </Segment>
            </Grid.Column>
            ) : ''}
            {(this.state.mode === 'update') ? (
            <Grid.Column>
              <Card>
                <Card.Content>
                  <UserAvatar />
                </Card.Content>
              </Card>
            </Grid.Column>
            ) : ''}
          </Grid.Row>
          </Grid>
        </Segment>
      </Container>
    );
  }
}
export default User;
