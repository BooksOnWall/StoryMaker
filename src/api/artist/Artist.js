import React, {Component } from 'react';

import {
  Segment,
  Header,
  Divider,
  Container,
  Form,
  Icon,
  Tab,
  Button,
  Image,
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
  marginBottom: 8,
  marginRight: 8,
  padding: 4
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

let options = {
    inline: { inDropdown: true },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: true },
    history: { inDropdown: true },
};

function Showimages(props) {

  if (!props.images || props.images.length === 0 ) return null;
  console.log(props.images);
  console.log(props.mode);
  let images = (props.mode === 'update' && !props.images.files) ? JSON.parse(props.images) : props.images.files ;
  console.log(images);
  const build = images.map((image, index) => {
    // switch oject structure from create to update
    image = (props.mode === 'update' && !props.images.files) ? image.image : image;

    return (
      <div  style={thumb} key={index} >
        <div  style={thumbInner} key={index} className='slide-out'>
          <Image
            key={index}
            rounded
            size='large'
            className='fadeIn'
            alt={image.name}
            src={props.server + image.path}
            />
        </div>
      </div>
    );
  });

    return build;
}
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
      percent: 0,
      selectedFile: null,
      setImages: this.setImages,
      saveImages: this.saveArtistImages,
      initialAValues: { name: '', email: '', description: '', images: null},
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
      open: false,
      editorState: EditorState.createEmpty(),
    };
    this.setImages = this.setImages.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

  }

  show = () => this.setState({ open: true })
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })

  handleChange(e) {

    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let change = {};
    change[e.target.name] = value ;
    this.setState({initialValues: change});

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
    this.state.loading = true;
    // prepare images name and path for store
    let images =[];
    Array.from(values.images).forEach(image => {
      images.push({
        'image': {
          'name': image.name,
          'path': 'images/artists/'+ this.state.aid + '/' + image.path
        }
      });
     });
    try {
      await fetch(this.state.artist+this.state.aid, {
        method: 'PATCH',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
        body:JSON.stringify({
          name: values.name,
          email:values.email,
          images: images,
          description:values.description
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.state.percent=15;
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
        this.props.history.push('/artists');
     });


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
            console.log(data.images);
            this.setState({aid: data.id, name: data.name, email: data.email, description: data.description, images : data.images});
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
      if(this.state.mode === 'update')  {
        await this.getArtist();

      }
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
  editArtist(values) {
      return (
        <div>
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
      </div>
    );
  }
  editImages(values) {
    return (
      <div>
        <aside style={thumbsContainer}>
          <Showimages mode={this.state.mode} images={this.state.images} server={this.state.server}/>
        </aside>
        <Divider horizontal>...</Divider>
        <Previews state={this.state} />
      </div>
    );
  }
  editBio(values) {
    return (
      <div>
      <Divider horizontal>...</Divider>

      <Editor
        toolbarOnFocus
        width= '80vw'
        height= '60vh'
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
      </div>
    );
  }
  onChangeHandler = event => {
    this.setState({
     selectedFile: event.target.files,
   });
  }
  render() {
    return (
        <Segment inverted color='violet' className="view" fluid>
          <Dimmer active={this.state.loading}>
            <Loader active={this.state.loading} >Get artist info</Loader>
          </Dimmer>
          <Header as='h6' icon floated='left'>
            <Link to="/artists">
              <Icon name='list' />
              List artists
            </Link>
          </Header>
          <Tab menu={{  color: 'violet', inverted: true, borderless: true, attached: false, tabular: false , secondary: true, pointing: true }} panes={[
              { menuItem: 'Edit Artist',
                render: () => <Tab.Pane>{this.editArtist(this.state.initialAValues)}</Tab.Pane>,
              },
              { menuItem: 'Images',
                render: () => <Tab.Pane>{this.editImages(this.state.initialAValues)}</Tab.Pane>,
              },
              { menuItem: 'Bio',
                render: () => <Tab.Pane>{this.editBio(this.state.initialAValues)}</Tab.Pane>,
              }
            ]}
          />
        </Segment>


    );
  }
}
export default Artist;
