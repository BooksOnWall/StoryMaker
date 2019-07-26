import React, { Component } from 'react';
import Auth from '../../module/Auth';

import {
  Segment,
  Header,
  Divider,
  Container,
  Form,
  Icon,
  Button,
  Confirm,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import { Formik } from 'formik';

import { Link } from 'react-router-dom';

//wysiwyg editor for textarea form fields
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

let options = {
    inline: { inDropdown: true },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: true },
    history: { inDropdown: true },
  };

class Artist extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      server: server,
      users: server + 'users',
      aid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
      mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
      name: null,
      loading: null,
      artist: server + 'artists/',
      data: null,
      initialValues: { name: '', email: '', description: ''},
      authenticated: this.toggleAuthenticateStatus,
      open: false,
      editorState: EditorState.createEmpty(),
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    this.toggleAuthenticateStatus = this.toggleAuthenticateStatus.bind(this);
  }
  show = () => this.setState({ open: true })
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })
  toggleAuthenticateStatus() {
  // check authenticated status and toggle state based on that
  this.setState({ authenticated: Auth.isUserAuthenticated() })
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
        await this.createArtist();
      } else {
        await this.updateArtist();
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
        await this.deleteArtist();
      }
    } catch(e) {
      console.log(e.message);
    }
  }
  async createArtist(values) {
    this.setState(values);
    try {
      await fetch(this.state.artist+0, {
        method: 'post',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body:JSON.stringify({
          name: this.state.name,
          email:this.state.email,
          description:this.state.description,
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
            this.props.history.push('/artists');
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
  async updateArtist(values) {
    try {
      await fetch(this.state.artist+this.state.aid, {
        method: 'PATCH',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
        body:JSON.stringify({
          name: values.name,
          email:values.email,
          description:values.description
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // redirect to users list page
            this.props.history.push('/artists');
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
  async getArtist() {
    // set loading
    this.setState({loading: true});
    try {
      await fetch(this.state.artist+this.state.aid, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {

            this.setState({aid: data.id, name: data.name, email: data.email, description: data.description});
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
  async deleteArtist() {
    try {
        await fetch(this.state.artist + this.state.aid, {
        method: 'delete',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body:JSON.stringify({ id: this.state.aid })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // redirect to user edit page
            this.props.history.push('/artists');
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
  async componentDidMount() {
    try {
      await this.toggleAuthenticateStatus();
      if(this.state.mode === 'update')  await this.getArtist();

    } catch(e) {
      console.log(e.message);
    }
  }
  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };
  render() {
    const { editorState } = this.state;
    return (
      <Container>
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get artist info</Loader>
        </Dimmer>
        <Segment>
          <Header as='h6' icon floated='left'>
            <Link to="/artists">
            <Icon name='list' />
            List artists
          </Link>
          </Header>
          <Header as='h6' icon >
            <Icon name='meh' />
            Edit Artist

          </Header>
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
                this.updateArtist(values);
              } else {
                this.createArtist(values);
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
                    <Divider horizontal>...</Divider>
                     <Editor
                       toolbarOnFocus
                        editorState={editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.onEditorStateChange}
                        toolbar={options}
                        name="sinopsys"
                        placeholder='Sinopsys'
                        value={values.sinopsys}
                      />
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
                           confirmButton="Delete Artist"
                           onCancel={this.handleCancel}
                           onConfirm={this.handleDelete}
                         />
                      </div>
                    ) : '' }
                  </Form>
                )}
              </Formik>
        </Segment>
      </Container>
    );
  }
}
export default Artist;
