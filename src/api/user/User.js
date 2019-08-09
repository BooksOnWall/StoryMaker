import React, { Component } from 'react';

import {
  Segment,
  Header,
  Divider,
  Container,
  Tab,
  Form,
  Icon,
  Button,
  Checkbox,
  Confirm,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import { Formik } from 'formik';
import UserPref from './userPreferences';
import UserAvatar from './userAvatar';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
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
      userEdit: {
        mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
        uid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
        initialPValues: { password: '', password2: '' },
        initialAValues: { avatar: '' },
        initialValues: { name: '', email: '', password: '', password2: '', active: 0, checked: false },
      },
      open: false,
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      setUserPreferences: this.props.state.setUserPreferences,
    };
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
                initialValues: this.state.userEdit.initialValues,
                initialPValues: this.state.userEdit.initialPValues,
                initialAValues: this.state.userEdit.initialAValues,
                userPrefs: data,
              }
            });
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
          if(datas) {
            let userPrefs = [];
            if(datas && datas.length > 0) {
              _.map(datas, ({ id, pname, pvalue }) => {
                pvalue = JSON.parse(pvalue);
                userPrefs.push({[pname]: pvalue});
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
                initialValues: this.state.userEdit.initialValues,
                initialPValues: this.state.userEdit.initialPValues,
                initialAValues: this.state.userEdit.initialAValues,
                userPrefs: userPrefs,
              }
            });
            //this.data.setUserPreferences({locale: data.locale, theme: data.theme, avatar: data.avatar});
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log(error)
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
                initialValues: data,
                initialPValues: this.state.userEdit.initialPValues,
                initialAValues: this.state.userEdit.initialAValues,
              },
              loading: false,
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
                initialValues: this.state.userEdit.initialValues,
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
  async deleteUser() {
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
    console.log(e.target);
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let change = {};
    change[e.target.name] = value ;
    this.setState({
      userEdit: {
        uid: this.state.userEdit.uid,
        name: this.state.userEdit.name,
        initialValues: change,
        initialPValues: this.state.userEdit.initialPValues,
        initialAValues: this.state.userEdit.initialAValues,
        userPrefs: this.state.userEdit.userPrefs,
      }
    });
    console.log(this.state.userEdit.initialValues.checked)
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
      if(this.state.userEdit.mode === 'update')  await this.getUser();

    } catch(e) {
      console.log(e.message);
    }
  }
  editForm() {
    return (
      <Segment >
      <Header as='h3' color='violet' textAlign='center'>
        {(this.state.userEdit.mode === 'create') ? <FormattedMessage id="app.user.create" defaultMessage={`Create user`}/> : <FormattedMessage id="app.user.edit" defaultMessage={`Edit user`}/> }
      </Header>
      <Formik
        enableReinitialize={true}
        initialValues={this.state.userEdit.initialValues}
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
          <Form className='slide-out' size='large' onSubmit={this.handleSubmit}>
            <input
              icon='user'
              iconposition='left'
              placeholder=<FormattedMessage id="app.user.name" defaultMessage={`Name`}/>
              autoFocus={true}
              type="text"
              name="name"
              onChange={handleChange}
              onBlur={handleBlur}
              value={(values && values.name) ? values.name : ''}
            />
            {errors.name && touched.name && errors.name}
            <Divider horizontal>...</Divider>
            <input
              icon='user'
              iconposition='left'
              placeholder=<FormattedMessage id="app.user.email" defaultMessage={`Email`}/>
              type="email"
              name="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={(values && values.email) ? values.email : ''}
            />
            {errors.email && touched.email && errors.email}
              {(this.state.userEdit.mode === 'create') ? (
              <div>
                <Divider horizontal>...</Divider>
                <input
                  icon='lock'
                  iconposition='left'
                  placeholder=<FormattedMessage id="app.user.password" defaultMessage={`Password`}/>
                  type="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
              {errors.password && touched.password && errors.password}
              <Divider horizontal>...</Divider>
                <input
                  icon='lock'
                  iconposition='left'
                  placeholder=<FormattedMessage id="app.user.repeatpassword" defaultMessage={`Repeat Password`}/>
                  type="password"
                  name="password2"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password2}
                />
              {errors.password2 && touched.password2 && errors.password2}
            </div>
              ) : ''}
            <Divider horizontal>...</Divider>
            <Checkbox
              icon='user'
              iconposition='left'
              placeholder='Active'
              ref = "active"
              label = <FormattedMessage id="app.user.active" defaultMessage={`Active`}/>
              name="active"
              defaultChecked= {(values && values.checked) ? values.checked : false }
              onChange = {(e, { checked }) => handleChange(checked)}
              onBlur = {handleBlur}
              defaultValue={(values && values.active) ? values.active : 0}
              toggle
            />
            {errors.active && touched.active && errors.active}
            <Divider horizontal>...</Divider>
            <Button onClick={handleSubmit} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
              {(this.state.userEdit.mode === 'create') ? <FormattedMessage id="app.user.created" defaultMessage={`Create`}/> : <FormattedMessage id="app.user.update" defaultMessage={`Update`}/>}
            </Button>
            {(this.state.userEdit.mode === 'update') ? (
              <div>
                <Button onClick={this.show} color='red' fluid size='large' type="submit" disabled={isSubmitting}>
                  <FormattedMessage id="app.user.delete" defaultMessage={`Delete`}/>
                </Button>
                <Confirm
                   open={this.state.open}
                   cancelButton=<FormattedMessage id="app.user.cancel" defaultMessage={`Never Mind`}/>
                   confirmButton=<FormattedMessage id="app.user.deleteUser" defaultMessage={`Delete User`}/>
                   onCancel={this.handleCancel}
                   onConfirm={this.handleDelete}
                 />
              </div>
            ) : '' }
          </Form>
        )}
      </Formik>
      </Segment>
    )
  }
  editPasswd() {
    return(
      <Segment>
        <Header as='h3' color='violet' textAlign='center'>
          <FormattedMessage id="app.user.passwdTitle" defaultMessage={`Change password`}/>
        </Header>
        <Formik

          initialValues={this.state.initialPValues}
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
            <Form className='slide-out' size='large' onSubmit={this.handleSubmit}>
              <Divider horizontal>...</Divider>
              <input
                icon='lock'
                iconposition='left'
                placeholder='Password'
                type="password"
                name="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={(values && values.password) ? values.password : '' }
                />
              {errors.password && touched.password && errors.password}
              <Divider horizontal>...</Divider>
              <input
                icon='lock'
                iconposition='left'
                placeholder='Repeat Password'
                type="password"
                name="password2"
                onChange={handleChange}
                onBlur={handleBlur}
                value={(values && values.password2) ? values.password2 : '' }
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
      <Segment>
        <Header as='h3' color='violet' textAlign='center'>
          User Preferences
        </Header>
        <UserPref state={this.props.state} id={parseInt(this.props.match.params.id)} toggleAuthenticateStatus={() => this.state.toggleAuthenticateStatus} />
      </Segment>
    );
  }
  editAvatar() {
    return (
      <UserAvatar state={this.props.state} id={parseInt(this.props.match.params.id)} toggleAuthenticateStatus={() => this.state.toggleAuthenticateStatus}/>
    );
  }
  render() {
    // display render only afetr we get initialValues for update mode
    if (this.state.userEdit.initialValues === null && this.state.userEdit.mode === 'update') return null;
    return (

      <Container  className="view" fluid>
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
        <Divider horizontal>...</Divider>
        <Tab menu={{  color: 'violet', inverted: true, borderless: true, attached: false, tabular: false , secondary: true, pointing: true }} panes={[
            { menuItem: 'Edit User',
              render: () => <Tab.Pane>{this.editForm()}</Tab.Pane>,
            },
            { menuItem: 'Password',
              render: () => <Tab.Pane>{this.editPasswd()}</Tab.Pane>,
            },
            { menuItem: 'Preferences',
              render: () => <Tab.Pane>{this.editPrefs()}</Tab.Pane>,
            },
            { menuItem: 'Avatar',
              render: () => <Tab.Pane>{this.editAvatar()}</Tab.Pane>,
            }
          ]}
        />
      </Container>

    );
  }
}
export default injectIntl(User);
