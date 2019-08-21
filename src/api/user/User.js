import React, { Component } from 'react';

import {
  Segment,
  Header,
  Divider,
  Container,
  Form,
  Icon,
  Input,
  Button,
  Checkbox,
  Confirm,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import { Formik } from 'formik';
import UsersSteps from './usersSteps';
import UserPref from './userPreferences';
import UserAvatar from './userAvatar';
import { Link } from 'react-router-dom';

import {
  injectIntl,
  FormattedMessage } from 'react-intl';

import _ from 'lodash';

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
      loading: null,
      userp: server + 'users/',
      userPref: server + 'userPref/',
      user: this.props.state.user,
      step : 'User',
      setSteps: this.setSteps,
      userEdit: {
        mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
        uid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
        initialPValues: { password: '', password2: '' },
        initialAValues: { avatar: '' },
        initialUValues: { name: '', email: '', password: '', password2: '', active: 0, checked: false },
      },
      open: false,
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      setUserPreferences: this.props.state.setUserPreferences,
    };
    this.setSteps = this.setSteps.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitP = this.handleSubmitP.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }

  // toggle user active slider
  toggle = () => this.setState( prevState => ({ checked: !prevState.checked }))
  // confirm functions for user delete
  show = () => this.setState({ open: true })
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })
  setSteps = (obj) => {
    if(obj) this.setState(obj);
  }
  handleChangeSteps= (e) =>{
    return this.setSteps(e);
  }
  async getUserPref() {
    try {
      await fetch(this.state.userPref+this.state.userEdit.uid, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({
              userEdit: {
                uid: this.state.userEdit.uid,
                name: this.state.userEdit.name,
                initialUValues: this.state.userEdit.initialUValues,
                initialPValues: this.state.userEdit.initialPValues,
                initialAValues: this.state.userEdit.initialAValues,
                userPrefs: data,
              },
              loading: false
            });
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
  async getUserPreferences(data) {
    try {
      await fetch(this.state.userp + this.state.userEdit.uid + '/prefs', {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(datas => {
        // todo moved avatar image to single file upload and return path to store in pvalue
          if(datas) {
            let userPrefs = [];
            if(datas && datas.length > 0) {
              _.map(datas, ({ id, pname, pvalue }) => {
                pvalue = JSON.parse(pvalue);
                userPrefs.push({[pname]: pvalue.value});
              });
            }
            // if edited user is the one that is connected
            // then update it's preferences ,
            // otherwise preferences will be updated at next session
            if(this.props.state.user.uid === this.state.userEdit.uid) this.props.state.setUserPreferences(userPrefs);
            this.setState({
              userEdit: {
                uid: this.state.userEdit.uid,
                name: this.state.userEdit.name,
                mode: this.state.userEdit.mode,
                initialUValues: this.state.userEdit.initialUValues,
                initialPValues: this.state.userEdit.initialPValues,
                initialAValues: this.state.userEdit.initialAValues,
                userPrefs: (userPrefs) ? userPrefs : null,
              },
              loading: false
            });
            console.log(userPrefs);
            this.props.state.setUserPreferences({locale: userPrefs.locale, theme: userPrefs.theme, avatar: userPrefs.avatar});
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log({error})
      });
    } catch(e) {

    }
  }
  async getUser() {
    // set loading
    this.setState({loading: true});
    try {
      await fetch(this.state.userp+this.state.userEdit.uid, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            data.checked = (data.active) ? true : false;
            // removed unwanted password hash
            delete data.password;
            data.checked = data.active;
            this.setState({
              userEdit: {
                uid: data.id,
                name: data.name,
                mode: this.state.userEdit.mode,
                initialUValues: {
                  name: data.name,
                  email: data.email,
                  password: '',
                  password2: '',
                  active: data.active,
                  checked: data.checked,
                },
                initialPValues: this.state.userEdit.initialPValues,
                initialAValues: this.state.userEdit.initialAValues,
              },
              loading: true,
            });
            return this.getUserPreferences(data);
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
    try {
      await fetch(this.state.userp+this.state.userEdit.uid, {
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
      await fetch(this.state.userp+0, {
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
            this.setState({
              userEdit: {
                uid: data.user.id ,
                name: this.state.userEdit.name,
                initialUValues: this.state.userEdit.initialUValues,
                initialPValues: this.state.userEdit.initialPValues,
                initialAValues: this.state.userEdit.initialAValues,
                userPrefs: this.state.userEdit.userPrefs,
              }
            })
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
  deleteUser = async () => {
    try {
        await fetch(this.state.userp + this.state.userEdit.uid, {
        method: 'delete',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body:JSON.stringify({ id: this.state.userEdit.uid })
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
  async setPassword(values) {
    try {
      await fetch(this.state.userp+this.state.userEdit.uid, {
        method: 'PATCH',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
        body:JSON.stringify({
          uid: this.state.userEdit.uid,
          password:values.password,
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
  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let change = {};
    change[e.target.name] = value ;
    this.setState({
      userEdit: {
        uid: this.state.userEdit.uid,
        name: this.state.userEdit.name,
        mode: this.state.userEdit.mode,
        initialUValues: change,
        initialPValues: this.state.userEdit.initialPValues,
        initialAValues: this.state.userEdit.initialAValues,
        userPrefs: this.state.userEdit.userPrefs,
      }
    });

  }

  async handleSubmit(e) {
    let mode = this.state.userEdit.mode;

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
  async handleSubmitP(e) {
    try {
        await this.setPassword();
    } catch(e) {
      console.log(e.message);
    }
  }
  async handleDelete(e) {
    e.preventDefault(); // Let's stop this event.

    let mode = this.state.userEdit.mode;
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
      await this.props.state.toggleAuthenticateStatus;
      if(this.state.userEdit.mode === 'update') {
        await this.getUser();
      }

    } catch(e) {
      console.log(e.message);
    }
  }
  editForm() {
    if(this.state.step !== 'User') {return null}
    if(!this.state.userEdit.name && this.state.userEdit.mode === 'update') {return null}
    return (
      <Segment className="slide-out" >
      <Header as='h3' color='violet' textAlign='center'>
        {(this.state.userEdit.mode === 'create') ? <FormattedMessage id="app.user.create" defaultMessage={`Create user`}/> : <FormattedMessage id="app.user.edit" defaultMessage={`Edit user`}/> }
      </Header>
      <Formik
        enableReinitialize={true}
        initialUValues={this.state.userEdit.initialUValues}
        validate={values => {
          let errors = {};
          if (!values.email) {
            errors.email =   <FormattedMessage id="app.user.required" defaultMessage={`Required`}/>;
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = <FormattedMessage id="app.user.invalidEmail" defaultMessage={`Invalid email`}/>;
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          if(this.state.userEdit.mode === 'update') {
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
            <Input
              icon='user'
              iconposition='left'
              placeholder= {<FormattedMessage id="app.user.userEdit.name" defaultMessage={'Name'}/>}
              autoFocus={true}
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              defaultValue={(values && values.name) ? values.name : ''}
            />
            {errors.name && touched.name && errors.name}

            <Input
              icon='mail'
              iconposition='left'
              placeholder={<FormattedMessage id="app.user.userEdit.email" defaultMessage={'Email'}/>}
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              defaultValue={(values && values.email) ? values.email : ''}
            />
            {errors.email && touched.email && errors.email}
            {(this.state.userEdit.mode === 'create') ? (
              <div>

                <Input
                  icon='lock'
                  iconposition='left'
                  placeholder={<FormattedMessage id="app.user.userEdit.password" defaultMessage={'Password'}/>}
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
              {errors.password && touched.password && errors.password}

                <Input
                  icon='lock'
                  iconposition='left'
                  placeholder={<FormattedMessage id="app.user.userEdit.repeatpassword" defaultMessage={'Repeat Password'}/>}
                  type="password"
                  name="password2"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password2}
                />
              {errors.password2 && touched.password2 && errors.password2}
            </div>
              ) : ''}
             <Checkbox
               toggle
               name="active"
               label = 'Active'
               onBlur = {handleBlur}
               defaultChecked ={(this.state.userEdit.initialUValues.active) ? true : false }
               onChange = {(e, { checked }) => handleChange(checked)}
               defaultValue = {(values && values.active) ? values.active : false}
              />

            {errors.active && touched.active && errors.active}
            <Divider horizontal>...</Divider>
              <Button onClick={handleSubmit} color='violet'   floated='right' type="submit" disabled={isSubmitting}>
                {(this.state.userEdit.mode === 'create') ? <FormattedMessage id="app.user.created" defaultMessage={`Create`}/> : <FormattedMessage id="app.user.update" defaultMessage={`Update`}/>}
              </Button>
            {(this.state.userEdit.mode !== 'create') ? (
                <div>
                  <Button onClick={this.show} color='red'  type="submit" disabled={isSubmitting}>
                    <FormattedMessage id="app.user.delete" defaultMessage={`Delete user`} />
                  </Button>
                  <Confirm
                    open = {this.state.open}
                    onCancel = {this.handleCancel}
                    onConfirm = {this.handleDelete}
                    cancelButton = {<Button secondary><FormattedMessage id="app.user.delete.cancel" defaultMessage="Never Mind"/></Button>}
                    confirmButton = {<Button primary onClick={this.deleteUser}><FormattedMessage id="app.user.delete.confirm" defaultMessage="Delete User"/></Button>}
                    />
                </div>
              ) : 'null' }
          </Form>
        )}
      </Formik>
      </Segment>
    )
  }
  editPasswd() {
    if(this.state.step !== 'Password') {return null}
    return(
      <Segment className='slide-out'>
        <Header as='h3' color='violet' textAlign='center'>
          <FormattedMessage id="app.user.passwdTitle" defaultMessage={`Change password`}/>
        </Header>
        <Formik
          initialUValues={this.state.userEdit.initialPValues}
          validate={values => {
            let errors = {};
            if (!values.password) {
              errors.password =  <FormattedMessage id="app.user.required" defaultMessage={`Required`}/>;
            } else if (
              values.password !== values.password2
            ) {
              errors.password =  <FormattedMessage id="app.user.wrongPasswd" defaultMessage={`Invalid repeat password`}/>;
            }
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            if(this.state.userEdit.mode === 'update') {
              this.setPassword(values);
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
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form  size='large' onSubmit={this.handleSubmit}>
              <Input
                fluid
                icon='lock'
                iconposition='left'
                placeholder='Password'
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={(values && values.password) ? values.password : '' }
                />
              {errors.password && touched.password && errors.password}
              <Input
                icon='lock'
                iconposition='left'
                fluid
                placeholder='Repeat Password'
                type="password"
                name="password2"
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={(values && values.password2) ? values.password2 : '' }
                />
              {errors.password2 && touched.password2 && errors.password2}
              <Divider horizontal>...</Divider>
              <Button onClick={handleSubmit} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
                {(this.state.userEdit.mode === 'create') ? 'Create' : 'Update'}
              </Button>
            </Form>
          )}
        </Formik>
    </Segment>
    );
  }
  editPrefs() {
    return (
        <UserPref state={this.props.state} id={parseInt(this.props.match.params.id)} toggleAuthenticateStatus={() => this.state.toggleAuthenticateStatus} />
    );
  }
  editAvatar() {
    return (
      <UserAvatar state={this.props.state} history={this.props.history} id={parseInt(this.props.match.params.id)} toggleAuthenticateStatus={() => this.state.toggleAuthenticateStatus}/>
    );
  }
render() {
    // display render only afetr we get initialUValues for update mode
    if (this.state.userEdit.initialUValues === null && this.state.userEdit.mode === 'update') return null;
    if (this.state.userEdit.initialUValues.name ==='' && this.state.userEdit.mode === 'update') { return null }
    return (

      <Container className="view" fluid >
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >
            <FormattedMessage id="app.user.loading" defaultMessage={`Get user info`}/>
          </Loader>
        </Dimmer>
        <Header as='h6' icon floated='left'>
            <Link to="/users">
              <Icon name='list' />
               List user
            </Link>
        </Header>
        <UsersSteps uid={this.state.userEdit.uid} step={this.state.step} state={this.state}/>
        <Segment>
            {(this.state.step === 'User') ? this.editForm() : ''}
            {(this.state.step === 'Password') ? this.editPasswd() : ''}
            {(this.state.step === 'Preferences') ? this.editPrefs() : ''}
            {(this.state.step === 'Avatar') ? this.editAvatar() : ''}
        </Segment>
      </Container>

    );
  }
}
export default injectIntl(User);
