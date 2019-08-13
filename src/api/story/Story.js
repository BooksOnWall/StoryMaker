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
import { ContentState, EditorState, RichUtils, convertFromHTML, convertToRaw } from 'draft-js';
import DraftPasteProcessor from 'draft-js/lib/DraftPasteProcessor';
import { convertToHTML } from 'draft-convert';
import { Editor } from 'react-draft-wysiwyg';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';

import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
// maps
import StoryMap from './map/storyMap';
//Stages
import StoryStages from './storyStages';
let options = {
    inline: { inDropdown: true },
    list: { inDropdown: true },
    textAlign: { inDropdown: true },
    link: { inDropdown: true },
    history: { inDropdown: true },
};
const htmlToState = (html) => {
  let synoState;
  const blocksFromHTML = convertFromHTML(html);
  const contentState = ContentState.createFromBlockArray(blocksFromHTML);
  synoState = EditorState.createWithContent(contentState);
  return synoState;
};
const stateToHtml = (synoState) => {
  const content = convertToHTML(synoState.getCurrentContent());
  return content;
};
class Story extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    let synoState;
    const sblocksFromHTML = convertFromHTML('Toto');
    const scontentState = ContentState.createFromBlockArray(sblocksFromHTML);
    synoState = EditorState.createWithContent(scontentState);
    let creditState;
    const cblocksFromHTML = convertFromHTML('Toto');
    const ccontentState = ContentState.createFromBlockArray(cblocksFromHTML);
    creditState = EditorState.createWithContent(ccontentState);

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
      synoState: synoState ,
      step: 'Story',
      artist: parseInt(1),
      setSteps: this.setSteps,
      storyCompleted: false,
      synoCompleted: false,
      creditState: creditState,
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
      open: false,
    };
    this.getStory = this.getStory.bind(this);
    this.onSynoStateChange = this.onSynoStateChange.bind(this);
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
  /* Build artist select options in editForm
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
              (artist.id === this.state.initialSValues.artist) ?
                artists.push({selected: true, active: true, key: artist.id , value: artist.id , text: artist.name }) :
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
  handleSubmitSyno = async (e) => {
      try {
        await fetch(this.state.stories+'/'+this.state.sid, {
          method: 'PATCH',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
          body:JSON.stringify({ sinopsys: this.state.sinopsys})
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              // set Step complete and forward to next step
              this.setState({storyComplete: true});
              this.setState({synoComplete: true, step: 'Stages'});
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
            this.setState({synoComplete: true});
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
  onSynoStateChange = (synoState) => {
    console.log(synoState);
    this.setState({
      synoState: synoState,
      sinopsys: stateToHtml(synoState),
    });

  }
  onCreditStateChange = (creditState) => {
    this.setState({
      creditState: creditState,
      credit: stateToHtml(creditState),
    });
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
          artist:parseInt(this.state.artist),
          state:this.state.state,
          city: this.state.city,
          sinopsys: this.state.sinopsys,
          credits: this.state.credits,
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
            this.setState({uid: data.user.id })
            this.props.history.push('/stories/'+data.user.id);
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
          artist:parseInt(this.state.initialSValues.artist),
          state:this.state.initialSValues.state,
          city: this.state.initialSValues.city,
          sinopsys: this.state.sinopsys,
          credits: this.state.credits,
          active: parseInt(this.state.initialSValues.active),
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // set Step complete and forward to next step
            this.setState({storyComplete: true, step: 'Synopsys'});
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
            console.log(data);
            //data.sinopsys = htmlToDraft(data.sinopsys);
            this.setState({synoState: htmlToState(data.sinopsys)});
            //data.credits = htmlToDraft(data.credits);
            //this.setState({creditState: data.credits});
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
        console.log(error)
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

  onSynoStateChange = (synoState) => {
    this.setState({synoState: synoState});
    this.setState({sinopsys: stateToHtml(synoState)});
  }
  onCreditStateChange = (creditState) => {
    this.setState({creditState: creditState});
    this.setState({credits: stateToHtml(creditState)});
  }
  EditCred = () => {
    if(this.state.step !== 'Credits') {return null};
    return (
      <Segment  className="view credits">
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
                onCreditStateChange,
                handleBlur,
                handleSubmitCredit,
                handleDelete,
                isSubmitting,
                /* and other goodies */
              }) => (

                <Form size='large' onSubmit={this.handleSubmitCredit}>

                  <Editor
                    toolbarOnFocus
                     editorState={this.state.creditState}
                     wrapperClassName="demo-wrapper"
                     editorClassName="demo-editor"
                     onEditorStateChange={this.onCreditStateChange}
                     toolbar={options}
                     name="credits"
                     placeholder='Credits'
                   />
                 <Button onClick={handleSubmitCredit} color='violet'  size='large' type="submit" disabled={isSubmitting}>
                     {(this.state.mode === 'create') ? 'Create' : 'Update'}
                   </Button>
                </Form>
              )}
            </Formik>
      </Segment>
    );
  }
  EditSyno = () => {
    if(this.state.step !== 'Synopsys') {return null;}
    if(!this.state.synoState) {return null}
    return (
    <Segment  className="view synopsys">
      <Formik
        enableReinitialize={true}
        initialValues={this.state.initialSValues}
        validate={values => {
          let errors = {};

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {

          console.log(JSON.stringify(this.state.synoState));
          this.handleSubmitSyno(this.state.synoState);
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
              onSynoStateChange,
              handleBlur,
              handleSubmitSyno,
              handleDelete,
              isSubmitting,
              /* and other goodies */
            }) => (
        <Form size='large' onSubmit={this.handleSubmitSyno}>
          <Editor
            toolbarOnFocus
             editorState={this.state.synoState}
             wrapperClassName="demo-wrapper"
             editorClassName="demo-editor"
             onEditorStateChange={this.onSynoStateChange}
             currentState={values.sinopsys}
             toolbar={options}
             name="sinopsys"
             placeholder='Sinopsys'
           />
         <Button onClick={handleSubmitSyno} floated='right'color='violet'  size='large' type="submit" disabled={isSubmitting}>
             {(this.state.mode === 'create') ? 'Create' : 'Update'}
           </Button>
       </Form>
     )}
   </Formik>
 </Segment>
    );
  }
  EditForm = () => {
    if(this.state.step !== 'Story') {return null;}
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
            <Select
              type="select"
              name="artists"
              onChange={(e, { selected }) => handleChange(selected)}
              onBlur={handleBlur}
              options={this.state.artistOptions}
              />
              <Input
                type="text"
                name="artist"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.artist}
                />
            <Divider horizontal>...</Divider>
            <Input
              placeholder='Title'
              autoFocus={true}
              type="text"
              name="title"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
              />
            {errors.title && touched.title && errors.title}
            <Divider horizontal>...</Divider>
            <Input
              placeholder='State'
              type="text"
              name="state"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.state}
              />
            {errors.state && touched.state && errors.state}
            <Divider horizontal>...</Divider>
            <Input
              placeholder='City'
              type="text"
              name="city"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.city}
              />
            {errors.city && touched.city && errors.city}
            <Checkbox
              placeholder='Active'
              ref = "active"
              label = "Active"
              name="active"
              defaultChecked= {this.state.initialSValues.checked}
              onChange = {(e, { checked }) => handleChange(checked)}
              onBlur = {handleBlur}
              value={(values.active === true) ? 1 : 0 }
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
            {this.EditForm()}
            {this.EditSyno()}
            {this.EditCred()}
            <StoryMap sid={this.state.sid} step={this.state.step} state={this.state} />
            <StoryStages sid={this.state.sid} step={this.state.step} state={this.state} />
          </Segment>
        </Segment>
      </Container>

    );
  }
}
export default Story;
