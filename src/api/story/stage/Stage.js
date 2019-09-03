import React, { Component, createRef } from 'react';

import {
  Form,
  Select,
  Card,
  Input,
  Label,
  Button,
  Icon,
  Confirm,
  Ref,
  Sidebar,
  Menu,
  Segment,
  TextArea,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import StorySteps from '../storySteps';
import StageSteps from './stageSteps';
import StageBoard from './board';
import StageMap from '../map/stageMap';
import StagePictures from './stagePictures';
import ReactHtmlParser from 'react-html-parser';

import { Link } from 'react-router-dom';

const stageOptions = [
  { key: 'Point', value: 'Point', text: 'Geo Point' },
  { key: 'linestring', value: 'linestring', text: 'Line String' },
  { key: 'audio', value: 'audio', text: 'Audio' }
];


class stage extends Component {
  constructor(props) {
      super(props);
      let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
      let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
      let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
      this.state = {
        server: server,
        stories: server + 'stories',
        artists: server + 'artists',
        sid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
        ssid: (!this.props.match.params.sid) ? (0) : (parseInt(this.props.match.params.sid)),
        mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
        name: null,
        stages: '/stories/' + this.props.sid + '/stages',
        stageURL: server + 'stories/' + this.props.sid + '/stages/' + parseInt(this.props.match.params.id),
        map:  '/stories/'+ this.props.sid  + '/map',
        loading: null,
        step: 'Stages',
        animation: 'slide along',
        direction: 'right',
        dimmed: null,
        descLock: 'lock',
        stageStep: 'Stage',
        tasks: [
            {name:"Photo",type: 'placeholder',params: {content: 'image'},category:"editStage", bgcolor: "primary"},
            {name:"Title",type: 'text',category:"editStage", bgcolor: "yellow"},
            {name:"Image", type: 'image' , src: 'https://www.sample-videos.com/img/Sample-jpg-image-100kb.jpg', category:"onZoneEnter", bgcolor:"pink"},
            {name:"Picture", type: 'image' , src: 'https://www.sample-videos.com/img/Sample-jpg-image-100kb.jpg', category:"wip", bgcolor:"pink"},
            {name:"Audio", type: 'audio' , src: 'https://sample-videos.com/audio/mp3/crowd-cheering.mp3', category:"wip", bgcolor:"skyblue"},
            {name:"Audio 2", type: 'audio' , src: 'https://sample-videos.com/audio/mp3/crowd-cheering.mp3', category:"onZoneEnter", bgcolor:"skyblue"},
            {name:"Audio 3", type: 'audio' , src: 'https://sample-videos.com/audio/mp3/crowd-cheering.mp3', category:"onZoneLeave", bgcolor:"skyblue"},
            {name:"Video", type: 'video' , src: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4', category:"onPictureMatch", bgcolor:"skyblue"},
            {name:"Text 2", type: 'text' , category:"wip", bgcolor:"skyblue"}
          ],
        sidebarVisible: false,
        botSidebarVisible: false,
        stage: {
          id: null,
          sid: this.props.sid,
          ssid: parseInt(this.props.match.params.id),
          name: '',
          adress: '',
          pictures: null,
          type: null,
          description: '',
          geometry: null,
          stageLocation: null
        },
        setSteps: this.setSteps,
        setStageLocation: this.setStageLocation,
        toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
        authenticated: this.props.childProps.authenticated,
      };
      this.setSteps = this.setSteps.bind(this);
      this.getStage= this.getStage.bind(this);
      this.lock=this.lock.bind(this);
      this.unlock=this.unlock.bind(this);
      this.toggleLock = this.toggleLock.bind(this);
  }
  segmentRef = createRef()

  handleHideClick = () => this.setState({ sidebarVisible: false })
  handleShowClick = () => this.setState({ sidebarVisible: true })
  handleSidebarHide = () => this.setState({ sidebarVisible: false })
  handleBotHideClick = () => this.setState({ botSidebarVisible: false })
  handleBotShowClick = () => this.setState({ botSidebarVisible: true })
  handleBotSidebarHide = () => this.setState({ botSidebarVisible: false })
  lock = () => this.setState({descLock: 'lock'})
  unlock = () => this.setState({descLock: 'unlock'})
  toggleLock = () => (this.state.descLock === 'lock') ? this.unlock() : this.lock()
  setSteps = (e) => this.setState(e)
  onDrop = (ev, cat) => {
     let id = ev.dataTransfer.getData("id");

     let tasks = this.state.tasks.filter((task) => {
          if(task.name === id) task.category = cat ;
         return task;
     });

     this.setState({
         ...this.state,
         tasks
     });
  }
  onDragStart = (ev, id) => {
      console.log('dragstart:',id);
      ev.dataTransfer.setData("id", id);
  }

  onDragOver = (ev) => {
      ev.preventDefault();
  }
  Location = (lngLat) => {
    this.setState({
      stage : {
        id: this.state.stage.id,
        sid: this.state.stage.sid,
        name: this.state.stage.name,
        adress: this.state.stage.adress,
        pictures: this.state.stage.pictures,
        type: this.state.stage.type,
        description: this.state.stage.description,
        geometry: this.state.stage.geometry,
        stageLocation: lngLat
      }
  });
  }
  onChangeHandler = (e) => {
    this.setState({stagePictures: e.files})
  }
  setPictures = (e) => {
    this.setState({stagePictures: e.files})
  }
  componentDidMount= async () => {
    try {
      await this.getStage();
    } catch(e) {
      console.log(e.message);
    }
  }

  handleAnimationChange = (animation) => () =>
    this.setState((prevState) => ({ animation, visible: !prevState.visible }))

  handleDimmedChange = (e, { checked }) => this.setState({ dimmed: checked })

  handleDirectionChange = (direction) => () =>
    this.setState({ direction, visible: false })
  editStage = () => {
    return (
      <Segment>
        <Segment>
          <Formik
            enableReinitialize={true}
            initialValues={this.state.initialSValues}
            validate={values => {
              let errors = {};
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              if(this.state.mode === 'update') {
                //    this.updateStage(values);
              } else {
                //  this.createStage(values);
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

              <Form  onSubmit={this.handleSubmit}>
                <Input
                  fluid
                  placeholder='Name'
                  label='Name'
                  autoFocus={true}
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={values.name}
                  />
                {errors.name && touched.name && errors.name}

                <Input
                  fluid
                  placeholder='calle, barrio, ciudad, pays'
                  label='Adress'
                  type="text"
                  name="adress"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={values.adress}
                  />
                {errors.adress && touched.adress && errors.adress}

                <Input
                  fluid
                  label='Stage Location'
                  placeholder='Stage Location'
                  type="text"
                  name="stagelocation"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={JSON.stringify(this.state.stage.stageLocation)}
                  />
                {errors.stagelocation && touched.stagelocation && errors.stagelocation}

                <Label>Stage type</Label><Select
                  placeholder='Stage type'
                  label='Stage type'
                  type="text"
                  name="stagetype"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={stageOptions}
                  defaultValue={values.stagetype}
                  />
                {errors.stagetype && touched.stagetype && errors.stagetype}

                <Button onClick={handleSubmit} floated='right'color='violet'  size='large' type="submit" disabled={isSubmitting}>
                  {(this.state.mode === 'create') ? 'Create' : 'Update'}
                </Button>
                {(this.state.mode === 'update') ? (
                  <div>
                    <Button onClick={this.show} color='red'  size='large' type="submit" disabled={isSubmitting}>
                      <FormattedMessage id="app.story.delete" defaultMessage={`Delete stage`}/>
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
      </Segment>
    );
  }
  getStage = async () => {
    this.setState({loading: true});
    try {
      await fetch(this.state.stageURL, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({
              stage: {
                id: data.id,
                sid: data.sid,
                name: data.name,
                adress: data.adress,
                pictures: data.pictures,
                type: data.type,
                description: data.description,
                geometry: data.geometry,
                stageLocation: Array.from(data.geometry.coordinates)
              }
            });
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
  stageDescription = () => {
    return (
      <Button onClick={this.toggleLock}><Icon name={this.state.descLock} /><Icon name="edit" /></Button>,
      (this.state.descLock === 'lock')
        ? <Card
          color='violet'
          header={this.state.stage.name}
          description={ReactHtmlParser(this.state.stage.description)}
        />
      : <Form color='violet'><TextArea
        className="desc-edit"
        name="description"
        placeholder='Description'
        value={this.state.stage.description}
        /></Form>
    )
  }
  handleStageStep = (e) => this.setState({stageStep: e.target.name})
  render() {
    const { log, logCount, visible } = this.state

    return (
      <Segment className="view" >
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get stage info</Loader>
        </Dimmer>
        <div>
        <StorySteps sid={this.state.sid} step={this.state.step} history={this.props.history} setSteps={this.setSteps} state={this.state}/>
          <StageBoard
            tasks={this.state.tasks}
            onDrop={this.onDrop}
            onDragStart={this.onDragStart}
            onDragOver={this.onDragOver}
            stage={this.state.stage}
            stageStep={this.state.stageStep}
            setStep={this.setSteps}
            handleStageStep={this.handleStageStep}
            handleShowClick={this.handleShowClick}
            handleHideClick = {this.handleHideClick}
            handleSidebarHide = {this.handleSidebarHide}
            handleBotHideClick = {this.handleBotHideClick}
            handleBotShowClick = {this.handleBotShowClick}
            handleBotSidebarHide = {this.handleBotSidebarHide}
            />

        </div>
      </Segment>
    );
  }
}

export default stage;
