import React, {Component } from 'react';
import {
  Segment,
  Header,
  Divider,
  Form,
  Icon,
  Input,
  Card,
  Button,
  Modal,
  Image,
  Confirm,
  Dimmer,
  Loader,
  Container,
} from 'semantic-ui-react';

import { FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import Previews from './preview';
import ArtistSteps from './artistSteps';

//wysiwyg editor for textarea form fields
import { EditorState, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const options = {
    inline: { inDropdown: true },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: false },
    history: { inDropdown: false },
};

function humanFileSize(bytes, si) {
    var thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    var units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    var u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}
 function Listimages(props) {
  if (!props.images || props.images.length === 0 ) return null;
  let images = (typeof(props.images) === 'string') ? JSON.parse(props.images) : props.images;
  //images = (typeof(images) === 'string') ? JSON.parse(images) : images;
  const build = images.map((image, index) => {
    // switch oject structure from create to update
    return (
      <Card key={index} className='inverted'>
        <Card.Content>
          <Modal inverted basic dimmer='blurring' closeIcon
            onClose={props.handleModalImgDeleteClose}
            size='fullscreen'
            trigger={<Image floated='right' src={props.server + image.image.path} />} centered={true} >
            <Modal.Content image>
              <Image wrapped src={props.server + image.image.path} />
            </Modal.Content>
            <Modal.Actions>
              <Button name={image.image.name} color='red' onClick={props.handleImageDelete} inverted>
                <Icon name='checkmark' /> Remove
              </Button>
            </Modal.Actions>
          </Modal>
        { /* <Card.Header as='h3'>{image.image.name}</Card.Header>
          <Card.Meta>{image.image.type}</Card.Meta>
          <Card.Description>
            { humanFileSize(image.image.size, true)}
          </Card.Description> */}
        </Card.Content>
      </Card>
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
      initialAValues: { name: '', email: '', bio: {}, images: null},
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
      open: false,
      modalImgDelete: false,
      bio: {},
      bioState: EditorState.createEmpty()
    };
    this.handleImageDelete = this.handleImageDelete.bind(this);
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
  setSteps = (obj) => { if(obj) this.setState(obj);}
  handleImageDelete(e) {
    const imgName = e.target.name;
    let images = (typeof(this.state.images) === 'string') ? JSON.parse(this.state.images) : this.state.images ;
    images = (typeof(images) === 'string') ? JSON.parse(images): images;
    // remove image object from images array
    images = images.filter(function(e) {
      return e.image.name !== imgName;
    });
    this.setState({images: JSON.stringify(images)});
    // delete array and file server side
    this.dropImage(imgName, images);
  }
  dropImage = async (name, images) => {
    try {
      await fetch(this.state.artist+this.state.aid+'/image', {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {'Access-Control-Allow-Origin': '*',  'Content-Type':'application/json'},
        body:JSON.stringify({
          name: name,
          images: images,
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // close modal window

            console.log(data); // to be send later in messages
            // redirect
            //this.props.history.push('/artists');
          }
      }).catch(error => console.log(error));
    } catch(e) { console.log(e.message); }
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
  handleImgDeleteOpen = () => this.setState({ modalImgDelete: true })
  handleModalImgDeleteClose = () =>  this.setState({ modalImgDelete: false })
  handleSubmitBio = async (e) => {
    this.setState({loading: true});
    let bio = (this.state.bio) ? this.state.bio : '';
      try {
        await fetch(this.state.artist+this.state.aid, {
          method: 'PATCH',
          credentials: 'same-origin',
          headers: {'Access-Control-Allow-Origin': '*', 'Content-Type':'application/json', charset:'utf-8' },
          body:JSON.stringify({ bio: bio})
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              // set Step complete and forward to next step
              this.setState({bioComplete: true, loading: false});
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

    // prepare images name and path for store
    let simages =[];
    if (images && images.files && images.files.length > 0) {
      this.setState({loading: true});
      //prepare aray of image name and path for store and let the rest for updateImages
      Array.from(images.files).forEach(file => {
        simages.push({
          'image': {
            'name': file.name,
            'size': file.size,
            'type': file.type,
            'path': 'assets/artists/'+ this.state.aid + '/' + file.name
          }
        });
       });
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
  }
  updateImages = async (files) => {
    console.log(files);
    //console.log(this.state.mode);
    //console.log(values.images);
    if(files) {
      this.setState({loading: true});
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
            //parse json returned
            data.images = (data.images && data.images.length > 0) ? data.images : null;
            data.images = (typeof(data.images) === 'string') ? JSON.parse(data.images) : data.images;
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
        credentials: 'same-origin',
        headers: {'Access-Control-Allow-Origin': '*',  'Content-Type':'application/json'},
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
  setEditor = (editor) => this.editor = editor;
  focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
  }
  setImages = (files) => this.setState({images: {files} })
  editArtist(values) {
      return (
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
                fluid
                transparent
                inverted
                label={<FormattedMessage id="app.artist.name" defaultMessage={'Name'}/>}
                icon='user'
                iconPosition='right'
                placeholder={<FormattedMessage id="app.artist.name" defaultMessage={'Name'}/>}
                autoFocus={true}
                type="text"
                name="name"
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={values.name}
                />
              {errors.name && touched.name && errors.name}
              <Divider />
              <Input
                fluid
                transparent
                inverted
                label={<FormattedMessage id="app.artist.email" defaultMessage={'E-mail address'}/>}
                icon='mail'
                iconposition='right'
                placeholder={<FormattedMessage id="app.artist.email" defaultMessage={'E-mail address'}/>}
                type="email"
                name="email"
                onChange={handleChange}
                onBlur={handleBlur}
                defaultValue={values.email}
                />
              {errors.email && touched.email && errors.email}

              <Divider />
                <div>
              <Button onClick={handleSubmit}  floated='right' primary size='large' type="submit" disabled={isSubmitting}> {(this.state.mode === 'create') ? 'Create' : 'Update' } </Button>
              {(this.state.mode === 'update') ? (
                <div>
                  <Button onClick={this.show} basic color='red' size='large'  type="submit" disabled={isSubmitting}><FormattedMessage id="app.artist.delete" defaultMessage={`Delete Artist`}/></Button>
                  <Confirm
                    open={this.state.open}
                    cancelButton='Never mind'
                    confirmButton="Delete Artist"
                    onCancel={this.handleCancel}
                    onConfirm={this.handleDelete}
                    />
                </div>

              ) : '' }
            </div>
            </Form>
          )}
        </Formik>
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
                 <Card.Group itemsPerRow={5}>
                {(this.state.images && this.state.images.length > 0) ? <Listimages mode={this.state.mode} handleImageDelete={this.handleImageDelete} handleImgDeleteOpen={this.handleImgDeleteOpen} handleModalImgDeleteClose={this.handleModalImgDeleteClose}  state={this.state} images={this.state.images} server={this.state.server}/> : ''}
                 </Card.Group>
              </aside>
              <Previews state={this.state} />
            </div>
            <div>
            <Button onClick={this.handleSubmitI} floated='right' primary size='large' type="submit" disabled={isSubmitting}>
              {(this.state.mode === 'create') ? 'Create' : 'Update'}
            </Button>
            </div>
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
              ref={this.setEditor}
              initialContentState={this.state.bio}
              editorState={this.state.bioState}
              wrapperClassName="demo-wrapper"
              editorClassName="demo-editor"
              onEditorStateChange={this.onBioStateChange}
              toolbar={options}
              name="bio"
              />
            <Divider/>
            <Button onClick={handleSubmitBio} floated='right' primary size='large'  type="submit" disabled={isSubmitting}>
              {(this.state.mode === 'create') ? 'Create' : 'Update'}
            </Button>
          </Form>
        )}
      </Formik>
    );
  }
  onChangeHandler = event => this.setState({ selectedFile: event.target.files })
  render() {
    return (
    <Container className="main artist" fluid>
      <Dimmer.Dimmable as={Segment} inverted className='view' blurring dimmed={this.state.loading}>
        <Dimmer active={this.state.loading} onClickOutside={this.handleHide} />
        <Loader active={this.state.loading} >Get artist info</Loader>

        <Header as={Segment} vertical size='medium'>
            {(this.state.mode === 'create') ? <FormattedMessage id="app.artist.title.create" defaultMessage={`Create Artist`}/> : <FormattedMessage id="app.artist.title.edit" defaultMessage={`Edit Artist`}/> }
        </Header>
        <ArtistSteps aid={this.state.aid} step={this.state.step} state={this.state}/>
        <Segment inverted clearing className="content">
        {(this.state.step === 'Artist') ? this.editArtist() : ''}
        {(this.state.step === 'Images') ? this.editImages() : ''}
        {(this.state.step === 'Bio') ? this.editBio() : ''}
        </Segment>
      </Dimmer.Dimmable>
    </Container>
    );
  }
}
export default Artist;
