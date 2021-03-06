import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Segment,
  Divider,
  Container,
  Checkbox,
  Form,
  Grid,
  Icon,
  Input,
  Button,
  Confirm,
  Dimmer,
  Loader,
  Header,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import StorySteps from './storySteps';
//wysiwyg editor for textarea form fields
import { EditorState,  ContentState } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToHTML } from 'draft-js-export-html';
import htmlToDraft from 'html-to-draftjs';
import sanitizeHtml from 'sanitize-html';
// maps
import StoryMap from './map/storyMap';
import StoryLocateMap from './map/storyLocateMap';
//Stages
import StoryStages from './stage/storyStages';


class Story extends Component {

  constructor(props) {
    super(props);

    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';

    this.state = {
      server: server,
      stories: server + 'stories',
      artists: server + 'artists',
      initialSValues:  (!this.props.match.params.id) ?{ artist: 1, title: '', state: '', city: '', sinopsys: '' , credits: '', tesselate: -1, geometry: null, active: true} : this.getStory,
      artistOptions: [],
      sid: (!this.props.match.params.id) ? (0) : parseInt(this.props.match.params.id),
      mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
      name: null,
      stagesURL: '/stories/' + this.props.match.params.id + '/stages',
      map:  '/stories/' + this.props.match.params.id + '/map',
      loading: null,
      data: null,
      story: null,
      title: '',
      state: '',
      city: '',
      sinoState: EditorState.createEmpty(),
      sinopsys: '',
      storyLocation: null,
      viewport: (parseInt(this.props.match.params.id) === 0) ? {
        longitude: 0,
        latitude: 0,
        zoom: 10,
        pitch: 0,
        bearing: 0,
      } : {},
      geometry: null,
      processPublish: false,
      openPublish: false,
      tesselate: null,
      stages: null,
      editorState: EditorState.createEmpty(),
      step: (this.props.step) ? this.props.step : 'Story',
      artist: parseInt(1),
      setSteps: this.setSteps,
      storyCompleted: (this.props.match.params.id && this.props.match.params.id > 0 ) ? true : false,
      sinoCompleted: false,
      active: parseInt(1),
      creditState: EditorState.createEmpty(),
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
      open: false,
    };

    this.getStory = this.getStory.bind(this);
    this.publish = this.publish.bind(this);
    this.updateStory = this.updateStory.bind(this);
    this.onSinoStateChange = this.onSinoStateChange.bind(this);
    this.onCreditStateChange = this.onCreditStateChange.bind(this);
    this.setSteps = this.setSteps.bind(this);
    this.EditForm = this.EditForm.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
  }
  show = (e) => {
    e.preventDefault();
    this.setState({ open: true })
  }
  showPublish = (e) => {
    e.preventDefault();
    this.setState({ openPublish: true })
  }
  setStoryLocation = (location) => {
    const geometry = {
      'type': 'Point',
      'coordinates': [
      location[0],
      location[1]
      ]
    };
    this.setState({geometry: geometry});
  }
  setFormDataLocation = ({place_name, geometry, center, context, viewport}) => {
    const city = (place_name) ? place_name.split(',')[0] : this.state.city ;
    const state = (place_name) ? place_name.split(',')[2] : this.state.country ;
    this.setState({
      city: city,
      state: state,
      geometry: {
        'type': 'Point',
        'coordinates': [viewport.longitude,viewport.latitude]
      },
      center: center,
      context: context,
      viewport: viewport,
    });
  }
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })
  handleCancelPublish = () => this.setState({ openPublish: false })
  handleChange(e) {
    const target = e.target;
    let value = (target.type === 'checkbox') ? target.checked : target.value;
    value = (target.type === 'select') ? target.selected : value;
    let change = {};
    change[e.target.name] = value ;
    let title = (target.name === 'title') ? target.value: this.state.title ;
    let city = (target.name === 'city') ? target.value: this.state.city;
    let country = (target.name === 'state') ?  target.value: this.state.state;
    console.log('country',country);
    this.setState({title: title, city: city, state: country ,initialSValues: change});
  }
  nextStep = (step) => {
    this.setState({step: step});
  }
  /* Build artist select artistOptions in editForm
  *
  */
  listArtists = async (e) => {
    try {
      await  fetch(this.state.artists, {
        method: 'GET',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            data = Object.values(data);
            const artists = [];
            data.map(artist => (
              (artist.id === this.state.artist) ?
                artists.push({selected: 'selected', active: true, key: artist.id , value: artist.id , text: artist.name }) :
                  artists.push({key: artist.id , value: artist.id , text: artist.name })
            ));
            this.setState({artistOptions: artists});
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
  setEditor = (editor) => {
      this.editor = editor;
  }
  focusEditor = () => {
      if (this.editor) {
        this.editor.focus();
      }
  }
  handleSubmitSino = async (e) => {

    let sinopsys = (this.state.sinopsys) ? this.state.sinopsys : '';
    console.log(sinopsys);
      try {
        await fetch(this.state.stories+'/'+this.state.sid, {
          method: 'PATCH',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
          body:JSON.stringify({ sinopsys: sinopsys})
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              // set Step complete and forward to next step
              this.setState({storyComplete: true});
              this.setState({sinoComplete: true, step: 'Stages'});
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
  handleSubmitCredit = async (values) => {
    try {
      await fetch(this.state.stories+'/'+this.state.sid, {
        method: 'PATCH',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
        body:JSON.stringify({ credits: this.state.credits})
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // set Step complete and forward to next step
            this.setState({storyComplete: true});
            this.setState({sinoComplete: true});
            this.setState({creditComplete: true, step: 'Stages'});
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

  handleSubmit = async (e) => {
    let mode = this.state.mode;

    try {
      if (mode ==='create') {
        await this.createStory();
      } else {
        await this.updateStory();
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
        await this.deleteStory();
      }
    } catch(e) {
      console.log(e.message);
    }
  }
  async createStory(values) {
    this.setState(values);
    try {
      const viewport = {
        longitude: this.state.viewport.longitude,
        latitude: this.state.viewport.latitude,
        zoom: this.state.viewport.zoom,
        pitch: this.state.viewport.pitch,
        bearing: this.state.viewport.bearing,
      };
      await fetch(this.state.stories +'/'+ 0, {
        method: 'post',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body:JSON.stringify({
          title: this.state.title,
          state:this.state.state,
          city: this.state.city,
          tesselate: this.state.tesselate,
          geometry: this.state.geometry,
          viewport: viewport,
          sinopsys: (this.state.sinopsys) ? sanitizeHtml(this.state.sinopsys) : '' ,
          credits: (this.state.credits) ? sanitizeHtml(this.state.credits) : '' ,
          artist:parseInt(this.state.artist),
          active: parseInt(this.state.active),
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // redirect to user edit page
            console.log(data);
            this.setState({sid: data.data.id })
            this.props.history.push('/stories' );
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

  async updateStory(values) {
    try {
      const viewport = {
        longitude: this.state.viewport.longitude,
        latitude: this.state.viewport.latitude,
        zoom: this.state.viewport.zoom,
        pitch: this.state.viewport.pitch,
        bearing: this.state.viewport.bearing,
      };
      await fetch(this.state.stories+'/'+this.state.sid, {
        method: 'PATCH',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
        body:JSON.stringify({
          title: this.state.title,
          state: this.state.state,
          city: this.state.city,
          tesselate: this.state.tesselate,
          geometry: this.state.geometry,
          viewport: viewport,
          sinopsys: sanitizeHtml(this.state.sinopsys),
          credits: sanitizeHtml(this.state.credits),
          artist:parseInt(this.state.artist),
          active: parseInt(this.state.active),
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            console.log(data);
            // set Step complete and forward to next step
            this.setState({storyComplete: true});
            return this.nextStep('Sinopsys');
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
  async publish() {
    this.setState({openPublish: false, processPublish: true});
    try {
      console.log('Publish !!!');
      await fetch(this.state.stories+'/'+this.state.sid+'/publish', {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            console.log('publish data', data.msg);
            this.setState({processPublish: false});
        } else {
          console.log('No Data received from the server');
        }
      })
      .catch((error) => {
        // Your error is here!
        console.log({error})
      });
    } catch(e) {
      console.log(e);
    }
  }
  async getStory() {
    this.setState({loading: true});
    try {
      await fetch(this.state.stories+'/'+this.state.sid, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            let story = data.story;

            story.sinopsys = (story.sinopsys) ? sanitizeHtml(story.sinopsys) : '<span>&nbsp</span>';
            story.credits = (story.credits) ? sanitizeHtml(story.credits) : '<span>&nbsp</span>';

            const sinoContentState = ContentState.createFromBlockArray(htmlToDraft(story.sinopsys));
            const sinoState = EditorState.createWithContent(sinoContentState);

            const creditContentState = ContentState.createFromBlockArray(htmlToDraft(story.credits));
            const creditState = EditorState.createWithContent(creditContentState);
            const oviewport = (story.viewport && typeof(story.viewport) === 'string') ? JSON.parse(story.viewport) : story.viewport;
            const viewport = {
              longitude: oviewport.longitude,
              latitude: oviewport.latitude,
              zoom: (oviewport.zoom) ? oviewport.zoom : 0,
              pitch: (oviewport.pitch) ? oviewport.pitch: 0,
              bearing: (oviewport.bearing) ? oviewport.bearing : 0,
            };
            this.setState({
              sid: story.id,
              title: story.title,
              artist: story.artist,
              sinoState: sinoState,
              sinopsys: story.sinopsys,
              creditState: creditState,
              credits: story.credits,
              state: story.state,
              city: story.city,
              stages: story.stages,
              tesselate: story.tesselate,
              geometry: story.geometry,
              viewport: viewport,
              initialSValues: story,
              story: story,
              loading: false,
            });

            return story;
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
  async deleteStory() {
    try {
        await fetch(this.state.stories +'/'+ this.state.sid, {
        method: 'delete',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body:JSON.stringify({ id: this.state.sid })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // redirect to user edit page
            this.props.history.push('/stories');
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
      await this.state.toggleAuthenticateStatus;
      await this.listArtists();
      if(this.state.mode === 'update')  await this.getStory();

    } catch(e) {
      console.log(e.message);
    }
  }

  onSinoStateChange = (sinoState) => {
    this.setState({sinoState: sinoState});
    this.setState({sinopsys: stateToHTML(sinoState.getCurrentContent())});
  }
  onCreditStateChange = (creditState) => {
    this.setState({creditState: creditState});
    this.setState({credits: stateToHTML(creditState.getCurrentContent())});
  }
  EditCred = () => {

    return (
      <Segment inverted className="view credits">
        <Editor
         editorState={this.state.creditState}
         wrapperClassName="demo-wrapper"
         editorClassName="demo-editor"
         onEditorStateChange={this.onCreditStateChange}
       />
        <Divider />
        <Button onClick={this.handleSubmitCredit} primary floated='right' size='large' type="submit" >
          {(this.state.mode === 'create') ? 'Create' : 'Update'}
        </Button>
      </Segment>
    );
  }
  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState: editorState,
    });
  }
  EditSino = () => {

    return (
      <Segment inverted className="view sinopsys">
          <Editor
           editorState={this.state.sinoState}
           wrapperClassName="demo-wrapper"
           editorClassName="demo-editor"
           onEditorStateChange={this.onSinoStateChange}
         />
        <Divider/>
        <Button onClick={this.handleSubmitSino} floated='right' primary size='large' type="submit" >
          {(this.state.mode === 'create') ? 'Create' : 'Update'}
        </Button>
      </Segment>
    );
  }
  EditForm = () => {
    const {processPublish, initialSValues} = this.state;
    return (
      <Segment placeholder className="story" inverted>
        <Grid columns={2} stackable textAlign='center'>
          <Grid.Row verticalAlign='middle'>
            <Grid.Column>
              <Formik
                enableReinitialize={true}
                initialValues={initialSValues}
                validate={values => {
                  let errors = {};
                  return errors;
                }}
                onSubmit={(values, { setSubmitting }) => {
                  if(this.state.mode === 'update') {
                    this.updateStory(values);
                  } else {
                    this.createStory(values);
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
                  <Form inverted  size='large' onSubmit={this.handleSubmit}>
                    <Segment inverted>
                      <span className='label small'>Choose artist/autor: </span><br/>
                      <select
                        size='small'
                        name="artist"
                        type="select"
                        defaultValue={this.state.artist}
                        onChange={this.handleChange}
                        >
                        <option key={0} disabled hidden value=''></option>
                        {this.state.artistOptions.map(options => <option key={options.key} value={options.value} >{options.text}</option>)}
                      </select>
                    </Segment>
                    <Divider/>
                    <Input
                      fluid
                      transparent
                      inverted
                      label={<FormattedMessage id="app.story.title" defaultMessage={'Title'}/>}
                      icon='pencil alternate'
                      iconposition='right'
                      placeholder={<FormattedMessage id="app.story.title" defaultMessage={'Title'}/>}
                      autoFocus={true}
                      type="text"
                      name="title"
                      onChange={this.handleChange}
                      onBlur={handleBlur}
                      defaultValue={this.state.title}
                      />
                    {errors.title && touched.title && errors.title}
                    <Divider/>
                    <Input
                      fluid
                      transparent
                      inverted
                      label={<FormattedMessage id="app.story.state" defaultMessage={'State'}/>}
                      icon='point'
                      iconposition='right'
                      placeholder={<FormattedMessage id="app.story.state" defaultMessage={'State'}/>}
                      type="text"
                      name="state"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      defaultValue={this.state.state}
                      />
                    {errors.state && touched.state && errors.state}
                    <Divider/>
                    <Input
                      fluid
                      transparent
                      inverted
                      label={<FormattedMessage id="app.story.city" defaultMessage={'City'}/>}
                      icon='point'
                      iconposition='right'
                      type="text"
                      name="city"
                      color="teal"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      defaultValue={this.state.city}
                      />
                    {errors.city && touched.city && errors.city}
                    <Divider  />
                    <Checkbox
                      label='Active'
                      placeholder=''
                      ref = "active"
                      name="active"
                      defaultChecked= {values.checked}
                      onChange = {(e, { checked }) => handleChange(checked)}
                      onBlur = {handleBlur}
                      defaultValue={(this.state.active === true) ? 1 : 0 }
                      toggle
                      />
                    {errors.active && touched.active && errors.active}
                    <Divider  />
                    <Button onClick={handleSubmit} floated='right' primary size='large' type="submit" disabled={isSubmitting}>
                      {(this.state.mode === 'create') ? 'Create' : 'Update'}
                    </Button>
                    {(this.state.mode === 'update') ? (
                      <div>
                        <Button onClick={this.show} color='red' basic floated='left' size='large' type="submit" disabled={isSubmitting}>
                          <FormattedMessage id="app.story.delete" defaultMessage={`Delete Story`}/>
                        </Button>
                        <Confirm
                          open={this.state.open}
                          cancelButton='Never mind'
                          confirmButton="Delete Story"
                          onCancel={this.handleCancel}
                          onConfirm={this.handleDelete}
                          />
                      </div>
                    ) : '' }
                    <div>
                      <Button onClick={this.showPublish} loading={processPublish} color='red' primary  size='large' type="submit" disabled={isSubmitting}>
                        <FormattedMessage id="app.story.publish" defaultMessage={`Publish Story`}/>
                      </Button>
                      <Confirm
                        open={this.state.openPublish}
                        cancelButton='Never mind'
                        content={'The version published will be: \n' + ((this.state.story && this.state.story.version) ? (this.state.story.version+1) : "1.0.0")}
                        confirmButton="Publish Story"
                        onCancel={this.handleCancelPublish}
                        onConfirm={this.publish}
                        />
                    </div>
                  </Form>
                )}
              </Formik>
            </Grid.Column>

            <Grid.Column>
              <Header icon style={{color: '#FFF'}}>
                <Icon name='world'  />
                Locate your Story
              </Header>
              {this.locateStory()}
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Segment>
    );
  }
  locateStory = () => {

    return (Object.keys(this.state.viewport).length > 0) ? (
      <StoryLocateMap
          sid={this.state.sid}
          city={this.state.city}
          viewport={this.state.viewport}
          geometry={this.state.geometry}
          stages={this.state.stages}
          height={'50vh'}
          width={'50vw'}
          setFormDataLocation={this.setFormDataLocation}
          setStoryLocation={this.setStoryLocation}
          />
      ) : '';

  }
  setSteps = (obj) => {
    if(obj) this.setState(obj);
  }
  handleChangeSteps= (e) =>{
    return this.setSteps(e);
  }
  render() {
    return (
      <Container fluid className="main">
        <Dimmer.Dimmable as={Segment} inverted className="view " blurring dimmed={this.state.loading}>
          <Dimmer active={this.state.loading} onClickOutside={this.handleHide} />
          <Loader className='loader' active={this.state.loading} >Get story info</Loader>
            <Header as={Segment} vertical size='medium'>
                {(this.state.mode === 'create') ? <FormattedMessage id="app.story.create" defaultMessage={`Create Story`}/> : <FormattedMessage id="app.story.edit" defaultMessage={`Edit Story`}/> }
            </Header>
            <StorySteps sid={this.state.sid} step={this.state.step}  setSteps={this.setSteps} state={this.state} location={this.props.location} />
            <Segment id='StepsContent' inverted>
                {(this.state.step === 'Story') ? this.EditForm() : '' }
                {(this.state.step === 'Sinopsys') ? this.EditSino() : '' }
                {(this.state.step === 'Credits') ? this.EditCred() : '' }
                {(this.state.step === 'Map' ) ? <StoryMap sid={this.state.sid}  history={this.props.history} step={this.state.step} state={this.state} story={this.state.story} viewport={this.state.viewport} geometry={this.state.geometry} /> : '' }
                {(this.state.step === 'Stages') ? <StoryStages sid={this.state.sid} history={this.props.history} step={this.state.step} state={this.state} story={this.state.story} viewport={this.state.viewport} geometry={this.state.geometry}/>  : '' }
            </Segment>
        </Dimmer.Dimmable>
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get story info</Loader>
        </Dimmer>
      </Container>

    );
  }
}
export default withRouter(Story);
