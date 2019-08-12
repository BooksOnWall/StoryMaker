import React, { Component } from 'react';

import {
  Segment,
  Header,
  Divider,
  Container,
  Checkbox,
  Form,
  Icon,
  Button,
  Confirm,
  Dimmer,
  Tab,
  Loader,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import StorySteps from './storySteps';
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

class Story extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      server: server,
      stories: server + 'stories',
      sid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
      mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
      name: null,
      stages: '/stories/' + this.props.match.params.id + '/stages',
      map:  '/stories/' + this.props.match.params.id + '/map',
      loading: null,
      data: null,
      active: 'Story',
      setSteps: this.setSteps,
      initialSValues: { title: '', state: '', city: '', sinopsys: '', credits: '', artist: '', active: true, checked: true},
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
      open: false,
      editorState: EditorState.createEmpty(),
    };
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
    const value = target.type === 'checkbox' ? target.checked : target.value;
    let change = {};
    change[e.target.name] = value ;
    this.setState({initialSValues: change});
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
  async updateStory(values) {
    try {
      await fetch(this.state.stories+'/'+this.state.sid, {
        method: 'PATCH',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
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
            // redirect to users list page
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
  async getStory() {
    // set loading
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

            this.setState({sid: data.id, title: data.title, artist: data.artist});
            this.setState({initialSValues: data});
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
      if(this.state.mode === 'update')  await this.getStory();

    } catch(e) {
      console.log(e.message);
    }
  }
  onEditorStateChange: Function = (editorState) => {
    this.setState({
      editorState,
    });
  };
  EditCred = () => {
    if(!this.state.active === 'Credits') return null;
    return (
      <Segment >
        <Formik
          visible = {this.state.active==='Synopsis'}
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

                <Form size='large' onSubmit={this.handleSubmitCredit}>

                  <Editor
                    toolbarOnFocus
                     editorState={this.state.editorState}
                     wrapperClassName="demo-wrapper"
                     editorClassName="demo-editor"
                     onEditorStateChange={this.onEditorStateChange}
                     toolbar={options}
                     name="credits"
                     placeholder='Credits'
                     value={values.credits}
                   />
                </Form>
              )}
            </Formik>
      </Segment>
    );
  }
  EditSyno = () => {
    if(!this.state.active === 'Synopsis') return null;
    return (
      <Formik
        visible = {this.state.active==='Synopsis'}
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

              <Form size='large' onSubmit={this.handleSubmitCredit}>
        <Editor
          toolbarOnFocus
           editorState={this.state.editorState}
           wrapperClassName="demo-wrapper"
           editorClassName="demo-editor"
           onEditorStateChange={this.onEditorStateChange}
           toolbar={options}
           name="sinopsys"
           placeholder='Sinopsys'
           value={values.sinopsys}
         />
       </Form>
     )}
   </Formik>
    );
  }
  EditForm = () => {
    if(!this.state.active === 'Story') return null;
    return (
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
              <input
                placeholder='Artist'
                type="text"
                name="artist"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.artist}
              />
              <Divider horizontal>...</Divider>
                <input
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
                <input
                  placeholder='State'
                  type="text"
                  name="state"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.state}
                />
              {errors.state && touched.state && errors.state}
                <Divider horizontal>...</Divider>
                <input
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
      );
  }
  setSteps = (obj) => {
    if(obj) this.setState(obj);
    console.log(obj);
  }
  handleChangeSteps= (e) =>{
    return this.setSteps(e);
  }
  handleTabChange = (e, { activeIndex }) => this.setState({ activeIndex });
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
          <StorySteps sid={this.state.sid} active={this.state.active} state={this.state}/>
          <Segment id='StepsContent'>
            {this.EditForm()}
            {this.EditSyno()}
            {this.EditCred()}
          </Segment>
        </Segment>
      </Container>

    );
  }
}
export default Story;
