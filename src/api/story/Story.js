import React, { Component } from 'react';

import {
  Segment,
  Header,
  Divider,
  Container,
  Checkbox,
  Form,
  Input,
  Select,
  Label,
  Icon,
  Button,
  Confirm,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import StorySteps from './storySteps';
import { Link } from 'react-router-dom';
//wysiwyg editor for textarea form fields
import { EditorState,  ContentState, convertFromHTML, convertToRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToHTML } from 'draft-js-export-html';
import htmlToDraft from 'html-to-draftjs';
import sanitizeHtml from 'sanitize-html';
// maps
import StoryMap from './map/storyMap';
//Stages
import StoryStages from './storyStages';


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
      initialSValues:  (!this.props.match.params.id) ?{ artist: 1, title: '', state: '', city: '', sinopsys: '' , credits: '', active: true} : this.getStory,
      artistOptions: [],
      sid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
      mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
      name: null,
      stages: '/stories/' + this.props.match.params.id + '/stages',
      map:  '/stories/' + this.props.match.params.id + '/map',
      loading: null,
      data: null,
      sinoState: EditorState.createEmpty(),
      sinopsys: '',
      editorState: EditorState.createEmpty(),
      step: 'Story',
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
  handleConfirm = () => this.setState({ open: false })
  handleCancel = () => this.setState({ open: false })
  handleChange(e) {
    const target = e.target;
    let value = (target.type === 'checkbox') ? target.checked : target.value;
    value = (target.type === 'select') ? target.selected : value;
    let change = {};
    change[e.target.name] = value ;
    this.setState({initialSValues: change});
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

  async handleSubmit(e) {
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
      await fetch(this.state.stories +'/'+ 0, {
        method: 'post',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body:JSON.stringify({
          title: this.state.title,
          state:this.state.state,
          city: this.state.city,
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
            this.setState({sid: data.data.id })
            this.props.history.push('/stories/' + data.data.id );
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
      await fetch(this.state.stories+'/'+this.state.sid, {
        method: 'PATCH',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
        body:JSON.stringify({
          title: this.state.initialSValues.title,
          state:this.state.initialSValues.state,
          city: this.state.initialSValues.city,
          sinopsys: sanitizeHtml(this.state.sinopsys),
          credits: sanitizeHtml(this.state.credits),
          artist:parseInt(this.state.initialSValues.artist),
          active: parseInt(this.state.initialSValues.active),
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
            
            data.sinopsys = (data.sinopsys) ? sanitizeHtml(data.sinopsys) : '<span>&nbsp</span>';
            data.credits = (data.credits) ? sanitizeHtml(data.credits) : '<span>&nbsp</span>';

            const sinoContentState = ContentState.createFromBlockArray(htmlToDraft(data.sinopsys));
            const sinoState = EditorState.createWithContent(sinoContentState);

            const creditContentState = ContentState.createFromBlockArray(htmlToDraft(data.credits));
            const creditState = EditorState.createWithContent(creditContentState);

            this.setState({sinoState: sinoState});
            this.setState({sinopsys: data.sinopsys});
            this.setState({creditState: creditState});
            this.setState({credits: data.credits});

            this.setState({sid: data.id, title: data.title, artist: data.artist});
            this.setState({initialSValues: data});
            this.setState({loading: false});
            return data;
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
      <Segment  className="view credits">
        <Editor
         editorState={this.state.creditState}
         wrapperClassName="demo-wrapper"
         editorClassName="demo-editor"
         onEditorStateChange={this.onCreditStateChange}
       />
        <Button onClick={this.handleSubmitCredit} color='violet'  size='large' type="submit" >
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
      <Segment  className="view sinopsys">
          <Editor
           editorState={this.state.sinoState}
           wrapperClassName="demo-wrapper"
           editorClassName="demo-editor"
           onEditorStateChange={this.onSinoStateChange}
         />
        <Button onClick={this.handleSubmitSino} floated='right'color='violet'  size='large' type="submit" >
          {(this.state.mode === 'create') ? 'Create' : 'Update'}
        </Button>

      </Segment>
    );
  }
  EditForm = () => {

    return (
    <Segment  className="view story">
      <Formik
        enableReinitialize={true}
        initialValues={this.state.initialSValues}
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

          <Form size='large' onSubmit={this.handleSubmit}>
            <Label >
              Choose your artist:
            <select name="artist" type="select" defaultValue={this.state.artist} onChange={this.handleChange}>
              <option key={0} disabled hidden value=''></option>
              {this.state.artistOptions.map(options => <option key={options.key} value={options.value} >{options.text}</option>)}
            </select>
            </Label>
            <Divider horizontal>...</Divider>
            <Input
              placeholder='Title'
              autoFocus={true}
              type="text"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              defaultValue={values.title}
              />
            {errors.title && touched.title && errors.title}
            <Divider horizontal>...</Divider>
            <Input
              placeholder='State'
              type="text"
              name="state"
              onChange={handleChange}
              onBlur={handleBlur}
              defaultValue={values.state}
              />
            {errors.state && touched.state && errors.state}
            <Divider horizontal>...</Divider>
            <Input
              placeholder='City'
              type="text"
              name="city"
              onChange={handleChange}
              onBlur={handleBlur}
              defaultValue={values.city}
              />
            {errors.city && touched.city && errors.city}
            <Checkbox
              placeholder='Active'
              ref = "active"
              label = "Active"
              name="active"
              defaultChecked= {values.checked}
              onChange = {(e, { checked }) => handleChange(checked)}
              onBlur = {handleBlur}
              defaultValue={(values.active === true) ? 1 : 0 }
              toggle
              />
            {errors.active && touched.active && errors.active}
            <Divider horizontal>...</Divider>
            <Button onClick={handleSubmit} floated='right'color='violet'  size='large' type="submit" disabled={isSubmitting}>
              {(this.state.mode === 'create') ? 'Create' : 'Update'}
            </Button>
            {(this.state.mode === 'update') ? (
              <div>
                <Button onClick={this.show} color='red'  size='large' type="submit" disabled={isSubmitting}>
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
          </Form>
        )}
      </Formik>
    </Segment>
    );
  }
  setSteps = (obj) => {
    if(obj) this.setState(obj);
  }
  handleChangeSteps= (e) =>{
    return this.setSteps(e);
  }
  render() {
    return (
      <Container  className="view" fluid>
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get artist info</Loader>
        </Dimmer>
        <Segment>
          <Header as='h6' icon >
            <Button primary size='mini' to="/stories" as={Link}>
              <Icon name='list' >  List stories</Icon>
            </Button>
          </Header>
          <StorySteps sid={this.state.sid} step={this.state.step} state={this.state} />
          <Segment id='StepsContent'>
            {(this.state.step === 'Story') ? this.EditForm() : '' }
            {(this.state.step === 'Sinopsys') ? this.EditSino() : '' }
            {(this.state.step === 'Credits') ? this.EditCred() : '' }
            {(this.state.step === 'Map') ? <StoryMap sid={this.state.sid} step={this.state.step} state={this.state} /> : '' }
            {(this.state.step === 'Stages') ? <StoryStages sid={this.state.sid} step={this.state.step} state={this.state} />  : '' }
          </Segment>
        </Segment>
      </Container>

    );
  }
}
export default Story;
