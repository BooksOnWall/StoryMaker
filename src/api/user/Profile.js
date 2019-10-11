
import React, { Component } from 'react';
import Auth from '../../module/Auth';
import {
  Segment,
  Header,
  Divider,
  Form,
  Image,
  Grid,
  Button,
  Checkbox,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import Logo from '../../logo.svg';
import UserPref from './userPreferences';

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false
    }
  };
  componentDidMount() {
    // check if user is logged in on refresh
    this.toggleAuthenticateStatus()
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  render() {
    return (
      <Grid id="profile" textAlign='center' columns={2} divided verticalAlign='top'>
        <Grid.Row>
        <Grid.Column style={{ maxWidth: 450 }}>
          <Header as='h2' color='orange' textAlign='center'>
            <Image className="App-logo" alt="logo" src={Logo} /><FormattedMessage id="app.user.profile.myprofile" defaultMessage={`My Profile`}/>
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
                  <Divider />
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
                  <Divider/>
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
                  <Divider />
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
                    <FormattedMessage id="app.user.profile.update" defaultMessage={`Update`}/>
                  </Button>
                </Form>
              )}
            </Formik>
            </Segment>
        </Grid.Column>
        <Grid.Column>
          <Header as='h2' color='orange' textAlign='center'>
            <Image className="App-logo" alt="logo" src={Logo} /><FormattedMessage id="app.user.profile.userpreferences" defaultMessage={`User preferences`}/>
          </Header>
          <UserPref toggleAuthenticateStatus={() => this.toggleAuthenticateStatus()} />
        </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}
export default Profile;
