import React, { Component, createRef, useState } from 'react';
import Auth from '../../module/Auth';
import { Slider } from "react-semantic-ui-range";

import {
  Segment,
  Header,
  Divider,
  Container,
  Form,
  Grid,
  Icon,
  Button,
  Label,
  Input,
  Card,
  Checkbox,
} from 'semantic-ui-react';

import { Formik } from 'formik';
import UserPref from './userPreferences';
import { Link } from 'react-router-dom';
import AvatarEditor from 'react-avatar-editor';

import src from '../../assets/images/patrick.png';


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
      avatar: {
        image: 'avatar.jpg',
        allowZoomOut: false,
        position: { x: 0.5, y: 0.5 },
        scale: 1,
        rotate: 0,
        borderRadius: 0,
        preview: null,
        width: 200,
        height: 200,
      }
    };
    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
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
  handleNewImage = e => {
      this.setState({...this.state.avatar, image: e.target.files[0] })
  }

  handleScale = e => {
      const scale = parseFloat(e.target.value)
      this.setState({...this.state.avatar, scale : scale })
  }

  handlePositionChange = position => {
      this.setState({...this.state.avatar,position: position })
  }
  onClickSave = () => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage()

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      //const canvasScaled = this.editor.getImageScaledToCanvas()
    }
  }
  setEditorRef = (editor) => this.editor = editor;
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

                    <div>
                      <div>
                        <AvatarEditor
                          ref={this.setEditorRef}
                          scale={parseFloat(this.state.avatar.scale)}
                          width={this.state.avatar.width}
                          height={this.state.avatar.height}
                          position={this.state.avatar.position}
                          onPositionChange={this.handlePositionChange}
                          rotate={parseFloat(this.state.avatar.rotate)}
                          borderRadius={this.state.avatar.width / (100 / this.state.avatar.borderRadius)}
                          image={src}
                          className="editor-canvas"
                          />
                      </div>
                    <br />
                    New File:
                    <input name="newImage" type="file" onChange={this.handleNewImage} />
                    <br />
                    Zoom:
                    <Slider color="red" settings={{
                      name: 'scale',
                      type: 'range',
                      onChange: this.handleScale,
                      min: this.state.avatar.allowZoomOut ? '0.1' : '1',
                      max: '20',
                      step: '0.01',
                      defaultValue: '1'
                    }} />
                
                    Allow Scale &lt; 1
                    <input
                      type="checkbox"
                      name="allowZoomOut"
                      value="on"
                    />
                    Border radius:
                    <input
                      type="range"
                      step="1"
                      min="0"
                      max="50"
                      name="scale"
                      value="0"
                    />
                    Avatar Width:
                    <input
                      type="number"
                      step="10"
                      min="50"
                      max="400"
                      name="width"
                      value="150"
                    />
                    Avatar Height:
                    <input
                      type="number"
                      step="10"
                      min="50"
                      max="400"
                      name="height"
                      value="150"
                    />
                    X Position:
                    <input
                      type="range"
                      step="0.01"
                      min="0"
                      max="1"
                      name="scale"
                      value="0.5"
                    />
                    Y Position:
                    <input
                      type="range"
                      step="0.01"
                      min="0"
                      max="1"
                      name="scale"
                      value="0.5"
                    />
                    Rotate:
                    <button>Left</button>
                    <button>Right</button>
                    </div>

                  </Card.Content>
                </Card>
                </Grid.Column>
                <Grid.Column>
                  <Card>
                    <Card.Header  color='violet'>{(this.state.mode === 'create') ? 'Create new User' : ''}</Card.Header>
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
