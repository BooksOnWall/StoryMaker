import React, {Component, useEffect, useState} from 'react';
import {useDropzone} from 'react-dropzone';
import {
  Segment,
  Header,
  Divider,
  Container,
  Form,
  Icon,
  Input,
  Button,
  Confirm,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import { Formik } from 'formik';
import Previews from './preview';
import { Link } from 'react-router-dom';

//wysiwyg editor for textarea form fields
import { EditorState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';


const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};
const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};

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
    let artist = server + 'artists/';
    let artistUpload = artist + parseInt(this.props.match.params.id) + '/upload';
    this.state = {
      server: server,
      users: server + 'users',
      aid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
      mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
      name: null,
      loading: null,
      artist: artist,
      artistUpload: artistUpload,
      data: null,
      images: [],
      selectedFile: null,
      setImages: this.setImages,
      saveImages: this.saveArtistImages,
      initialValues: { name: '', email: '', description: ''},
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
      open: false,
      editorState: EditorState.createEmpty(),
    };
    this.setImages = this.setImages.bind(this);
    this.saveImages = this.saveImages.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

  }

  show = () => this.setState({ open: true })
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })
  async saveImages(e) {
    console.log(e);
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
    console.log(values);
    try {
      await fetch(this.state.artist+this.state.aid, {
        method: 'PATCH',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
        body:JSON.stringify({
          name: values.name,
          email:values.email,
          images: values.images,
          description:values.description
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // redirect to users list page or batch upload images
            (values.images) ? this.onClickHandler(values.images) : this.props.history.push('/artists');
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
  onClickHandler = async (files) => {
    let formData = new FormData();
    for(var x = 0; x < files.length; x++) {
      formData.append('file', files[x]);
    };
    await fetch(this.state.artistUpload, {
      method: 'POST',
      credentials: 'same-origin',
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Accept':'application/json; charset=utf-8'
      },
      files: JSON.stringify(files),
      body: formData
     })
     .then(response => response.json())
     .then(data => {

     });
     await this.props.history.push('/artists');

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
      if(this.state.mode === 'update')  await this.getArtist();
      this.focusEditor();
    } catch(e) {
      console.log(e.message);
    }
  }
  onEditorStateChange: Function = (editorState) => {
    console.log(editorState);
    this.setState({
      editorState,
    });
  }
  setEditor = (editor) => {
      this.editor = editor;
  }
  focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
  }
  setImages = (files) => {
    // prep store artist images

    this.setState({images: {files} });
  }
  onChangeHandler = event => {
    this.setState({
     selectedFile: event.target.files,
   });
  }

  render() {
    return (

      <Container className="main">
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get artist info</Loader>
        </Dimmer>
        <Segment className="view">
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
              values.images = document.getElementById("artistFiles").files;
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
                  onEditorStateChange,
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
                    <Previews state={this.state} />
                    <Divider horizontal>...</Divider>
                     <Editor
                       toolbarOnFocus
                        ref={this.setEditor}
                        editorState={this.state.editorState}
                        wrapperClassName="demo-wrapper"
                        editorClassName="demo-editor"
                        onEditorStateChange={this.onEditorStateChange}
                        toolbar={options}
                        name="description"
                        placeholder='Description'
                        value={values.description}
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
