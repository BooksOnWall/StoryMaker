import React, {Component } from 'react';

import {
  Segment,
  Header,
  Divider,
  Form,
  Icon,
  Input,
  Button,
  Image,
  Confirm,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import Previews from './preview';
import ArtistSteps from './artistSteps';
import { Link } from 'react-router-dom';

//wysiwyg editor for textarea form fields
import { EditorState, convertToRaw , convertFromRaw } from 'draft-js';
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

function Listimages(props) {
  if (!props.images || props.images.length === 0 ) return null;
  let images = props.images;
  const build = images.map((image, index) => {
    // switch oject structure from create to update
    return (
      <div  style={thumb} key={index} >
        <div  style={thumbInner} key={index} className='slide-out'>
          <Image
            key={index}
            rounded
            size='large'
            className='fadeIn'
            alt={image.image.name}
            src={props.server + image.image.path}
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
      loading: false,
      artist: artist,
      artistUpload: artistUpload,
      images: [],
      step: 'Artist',
      setSteps: this.setSteps,
      artistCompleted: false,
      activeIndex: parseInt(1),
      selectedFile: null,
      setImages: this.setImages,
      saveImages: this.saveArtistImages,
      initialAValues: { name: '', email: '', bio: {}, images: null},
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
      open: false,
      bio: {},
      bioState: EditorState.createEmpty(),
    };
    this.setSteps = this.setSteps.bind(this);
    this.setImages = this.setImages.bind(this);
    this.onBioStateChange = this.onBioStateChange.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleSubmitI = this.handleSubmitI.bind(this);
    this.handleDelete = this.handleDelete.bind(this);

  }

  show = () => this.setState({ open: true })
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })
  setSteps = (obj) => {
    if(obj) this.setState(obj);

  }
  handleChangeSteps= (e) =>{
    return this.setSteps(e);
  }
  handleChange(e) {
    const target = e.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let change = {};
    change[e.target.name] = value ;
    this.setState({initialAValues: change});

  }
  async handleSubmitI(e) {
    let mode = this.state.mode;
    let images = (this.state.selectedFile) ? this.state.selectedFile : this.state.images;
    try {
      if (mode ==='update') {
        await this.updateArtistImages(images);
      }
    } catch(e) {
      console.log(e.message);
    }
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
  handleSubmitBio = async (e) => {

    let bio = (this.state.bio) ? this.state.bio : '';
      try {
        await fetch(this.state.artist+this.state.aid, {
          method: 'PATCH',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
          body:JSON.stringify({ bio: bio})
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              // set Step complete and forward to next step
              this.setState({bioComplete: true});
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
          bio:this.state.bio,
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
    this.setState({loading: true});
    try {
      await fetch(this.state.artist + this.state.aid, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type':'application/json',
          charset:'utf-8' },
        body:JSON.stringify({
          name: values.name,
          email:values.email,
          bio:values.bio
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.props.history.push('/artists')
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
  async updateArtistImages(images) {
    this.setState({loading: true});
    // prepare images name and path for store
    let simages =[];
    if (images && images.files && images.files.length > 0) {
      //prepare aray of image name and path for store and let the rest for updateImages
      Array.from(images.files).forEach(file => {
        simages.push({
          'image': {
            'name': file.name,
            'path': 'images/artists/'+ this.state.aid + '/' + file.name
          }
        });
       });
    }
    try {
      await fetch(this.state.artist + this.state.aid, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type' :'application/json',
          charset:'utf-8' },
        body:JSON.stringify({
          images: simages,
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
            if(images.files) { this.updateImages(images.files); }
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
  updateImages = async (files) => {
    //console.log(this.state.mode);
    //console.log(values.images);
    if(files) {

      try {
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
      } catch(e) {
        console.log(e.message);
      }
    }
  }
  async getArtist() {
    // set loading
    this.setState({loading: true});
    try {
      await fetch(this.state.artist+this.state.aid, {
        method: 'get',
        credentials: 'same-origin',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type':'application/json'
        }
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            if (data.bio) {
              const bioContentState = convertFromRaw(data.bio);
              const bioState = EditorState.createWithContent(bioContentState);
              this.setState({bio: data.bio});
              this.setState({bioState: bioState});
            }
            //parse json returned
            data.images = (data.images && data.images.length > 0) ? data.images : null;
            this.setState({aid: data.id, name: data.name, email: data.email, bio: data.bio, images : data.images});
            this.setState({initialAValues: {
              aid: data.id,
              name: data.name,
              email: data.email,
              images: data.images,
              bio: (data.bio) ? data.bio : null
            }});
            this.setState({loading: false});
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log({error})
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
  onBioStateChange = (bioState) => {
    this.setState({
      bioState: bioState,
      bio: convertToRaw(bioState.getCurrentContent())
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
          initialValues={this.state.initialAValues}
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
              <Input
                icon='user'
                iconposition='left'
                placeholder='Name'
                autoFocus={true}
                type="text"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={values.name}
                />
              {errors.name && touched.name && errors.name}
              <Divider horizontal>...</Divider>
              <Input
                icon='mail'
                iconposition='left'
                placeholder='E-mail address'
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={values.email}
                />
              {errors.email && touched.email && errors.email}

              <Divider horizontal>...</Divider>
              <Button onClick={handleSubmit} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
                {(this.state.mode === 'create') ? 'Create' : 'Update'}
              </Button>
              {(this.state.mode === 'update') ? (
                <div>
                  <Button onClick={this.show} color='red' fluid size='large' type="submit" disabled={isSubmitting}>
                    <FormattedMessage id="app.artist.delete" defaultMessage={`Delete Artist`}/>
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
      <Formik
        enableReinitialize={true}
        initialValues={this.state.initialAValues}
        validate={values => {
          let errors = {};
          values.images = document.getElementById("artistFiles").files;
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          values.images = document.getElementById("artistFiles").files;


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
          handleSubmitI,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Form size='large' onSubmit={this.handleSubmitI}>
            <div>
              <aside style={thumbsContainer}>
                {(this.state.images && this.state.images.length > 0) ? <Listimages mode={this.state.mode} images={this.state.images} server={this.state.server}/> : ''}
              </aside>
              <Divider horizontal>...</Divider>
              <Previews state={this.state} />
            </div>
            <Divider horizontal>...</Divider>
            <Button onClick={this.handleSubmitI} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
              {(this.state.mode === 'create') ? 'Create' : 'Update'}
            </Button>
          </Form>
        )}
      </Formik>

    );
  }
  editBio(values) {
    return (
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
            this.updateBio(values);
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
          handleSubmitBio,
          handleDelete,
          onBioStateChange,
          isSubmitting,
          /* and other goodies */
        }) => (
          <Form size='large' onSubmit={this.handleSubmitBio}>
            <Editor
              toolbarOnFocus
              width= '80vw'
              height= '60vh'
              ref={this.setEditor}
              initialContentState={this.state.bio}
              editorState={this.state.bioState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={this.onBioStateChange}
              toolbar={options}
              name="bio"
              placeholder='Biographie'
              value={values.bio  }
              />
            <Divider horizontal>...</Divider>
            <Button onClick={handleSubmitBio} color='violet' fluid size='large' type="submit" disabled={isSubmitting}>
              {(this.state.mode === 'create') ? 'Create' : 'Update'}
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
  onChangeHandler = event => {
    this.setState({
     selectedFile: event.target.files,
   });
  }
  render() {
    return (
        <Segment className="view" >
          <Dimmer active={this.state.loading}>
            <Loader active={this.state.loading} >Get artist info</Loader>
          </Dimmer>
          <Header as='h6' icon floated='left'>
            <Link to="/artists">
              <Icon name='list' />
              List artists
            </Link>
          </Header>
          <ArtistSteps  aid={this.state.aid} step={this.state.step} state={this.state}/>
          {(this.state.step === 'Artist') ? this.editArtist() : ''}
          {(this.state.step === 'Images') ? this.editImages() : ''}
          {(this.state.step === 'Bio') ? this.editBio() : ''}
        </Segment>


    );
  }
}
export default Artist;
