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
  Image,
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
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
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
        stages: '/stories/' + this.props.match.params.id + '/stages',
        stageURL: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid),
        stageImagesUploadUrl: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid) + '/uploadImages',
        stagePicturesUploadUrl: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid) + '/uploadPictures',
        map:  '/stories/'+ this.props.match.params.id  + '/map',
        loading: null,
        step: 'Stages',
        animation: 'slide along',
        direction: 'right',
        dimmed: null,
        descLock: 'lock',
        stageStep: 'Stage',
        tasks: [
            {name:"Image", type: "image" , src: "https://www.sample-videos.com/img/Sample-jpg-image-100kb.jpg", category:"onZoneEnter", bgcolor:"pink"},
            {name:"Picture", type: "image" , src: "https://www.sample-videos.com/img/Sample-jpg-image-100kb.jpg", category:"onZoneLeave", bgcolor:"pink"},
            {name:"Audio", type: "audio" , src: "https://sample-videos.com/audio/mp3/crowd-cheering.mp3", category:"onZoneLeave", bgcolor:"skyblue"},
            {name:"Audio 2", type: "audio" , src: "https://sample-videos.com/audio/mp3/crowd-cheering.mp3", category:"onZoneEnter", bgcolor:"skyblue"},
            {name:"Audio 3", type: "audio" , src: "https://sample-videos.com/audio/mp3/crowd-cheering.mp3", category:"onZoneLeave", bgcolor:"skyblue"},
            {name:"Video", type: "video" , src: "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4", category:"onPictureMatch", bgcolor:"skyblue"},
            {name:"Text 2", type: "text" , category:"wip", bgcolor:"skyblue"}
          ],
        sidebarVisible: false,
        topSidebarVisible: false,
        stage: {
          id: null,
          sid: this.props.match.params.id,
          ssid: parseInt(this.props.match.params.id),
          name: '',
          adress: '',
          pictures: null,
          type: null,
          description: '',
          geometry: null,
          stageLocation: null
        },
        imagesLoading: false,
        picturesLoading: false,
        stagePictures: [],
        setSteps: this.setSteps,
        setStageLocation: this.setStageLocation,
        toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
        authenticated: this.props.childProps.authenticated,
      };
      this.mergeTasks = this.mergeTasks.bind(this);
      this.uploadImages = this.uploadImages.bind(this);
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
  handleTopHideClick = () => this.setState({ topSidebarVisible: false })
  handleTopShowClick = () => this.setState({ topSidebarVisible: true })
  handleTopSidebarHide = () => this.setState({ topSidebarVisible: false })
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
      console.log(ev);
      ev.dataTransfer.setData("id", id);
  }

  onDragOver = (ev) => {
      ev.preventDefault();
  }
  renderTasks = () => {
    var tasks = {
      title: [],
      photo: [],
      description: [],
      location: [],
      wip: [],
      pictures: [],
      images: [],
      editStage: [],
      onZoneEnter: [],
      onPictureMatch: [],
      onZoneLeave: []
    };
    if (this.state.tasks) {
      this.state.tasks.forEach ((t) => {
        switch(t.type) {
          case 'text':
          tasks[t.category].push(
            <Segment
              inverted
              name={t.name}
              color="orange"
              key={t.name}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="draggable"
              style = {{backgroundColor: t.bgcolor}}
              >
              {t.name}
            </Segment>
          );
          break;
          case 'image':
          tasks[t.category].push(
            <Image
              key={t.name}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="draggable"
              src={t.src}
              />
          );
          break;
          case 'picture':
          tasks[t.category].push(
            <Image
              key={t.name}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="draggable"
              src={t.src}
              />
          );
          break;
          case 'video':
          tasks[t.category].push(
            <Segment
              inverted
              color="violet"
              key={t.name}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="draggable video"
              >
              <Player
                fluid
                preload="auto"
                playsInline
                poster="/assets/poster.png"
                >
                <source src="https://media.w3.org/2010/05/sintel/trailer_hd.mp4" />
              </Player>
            </Segment>

          );
          break;
          case 'audio':
          tasks[t.category].push(
            <Segment
              inverted
              color="green"
              key={t.name}
              onDragStart = {(e) => this.props.onDragStart(e, t.name)}
              draggable
              className="draggable"
              >
              <ReactAudioPlayer
                key={t.name}
                src={t.src}
                controls
                />
            </Segment>
          );
          break;
          default:
          break;
        }}
      )
    }
    return tasks;
  }
  mergeTasks = (cat, list) => {

    if(list) {
      let tasks = this.state.tasks;
      console.log(tasks);
      console.log(list);
      let server = this.state.server;
      switch(cat) {
        case 'Images':
        let imageArray =[];
        list.forEach(function(image) {

          let img = image.image;
          console.log(img);
          let json = {
            name: img.name,
            type: "image",
            category:"images",
            src: server + img.path
          };
          imageArray.push(json);
        });
        tasks = tasks.concat(imageArray);
        break;
        case 'Pictures':
        let picturesArray =[];
        list.forEach(function(image) {
          let img = image.image;
          let json = {
            name: img.name,
            type: "image",
            category:"pictures",
            src: server + img.path
          };
          picturesArray.push(json);
        });
        tasks = tasks.concat(picturesArray);
        break;
        default:
        break;
      }
      this.setState({tasks:tasks});
      console.log(tasks);
      //return tasks;
      return true;
    }
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
  onChangePicturesHandler = (e) => {
    this.setState({stagePictures: e.files})
  }
  onChangeImagesHandler = (e) => {
    this.setState({stageImages: e.files});
  }
  setStagePictures = (e) => {
    this.setState({stagePictures: e});
  }
  setStageImages = (e) => {
    this.setState({stageImages: e});
  }
  componentDidMount= async () => {
    try {
      await this.getStage();
    } catch(e) {
      console.log(e.message);
    }
  }

  handleAnimationChange = (animation) => () => this.setState((prevState) => ({ animation, visible: !prevState.visible }))
  handleDimmedChange = (e, { checked }) => this.setState({ dimmed: checked })
  handleDirectionChange = (direction) => () => this.setState({ direction, visible: false })
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

  uploadImages = async () => {
    console.log('clicked');
    this.setState({imagesLoading: true});
    // get images and prepare for store
    let images = this.state.stageImages;
    if (images  && images.length > 0) {
      try {
        let simages =[];

        Array.from(images).forEach(file => {
          simages.push({
            'image': {
              'name': file.name,
              'size': file.size,
              'type': file.type,
              'path': 'images/stories/'+ this.state.sid + '/stages/' + this.state.ssid + '/images/' + file.name
            }
          });
        });
        let files = JSON.stringify(images);
        let formData = new FormData();
        for(var x = 0; x < images.length; x++) {
          formData.append('file', images[x]);
        };
        await fetch(this.state.stageImagesUploadUrl, {
          method: 'POST',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin'},
          files: files,
          body: formData
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              this.setState({
                stage: {
                  id: this.state.stage.id,
                  sid: this.state.stage.sid,
                  name: this.state.stage.name,
                  adress: this.state.stage.adress,
                  pictures: this.state.stage.pictures,
                  images: simages,
                  type: this.state.stage.type,
                  description: this.state.stage.description,
                  geometry: this.state.stage.geometry,
                  stageLocation: Array.from(this.state.stage.geometry.coordinates)
                }
              });
              //this.setState({initialSValues: data});

              //let tasks = JSON.stringify(this.mergeTasks('Images', simages));
              //console.log(tasks);
              this.setState({topSidebarVisible: false, stageImages: null, imagesLoading: false});
              this.getStage();

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
  }
  uploadPictures = async () => {
    console.log('clicked');
    this.setState({picturesLoading: true});
    // get images and prepare for store
    let images = this.state.stagePictures;
    if (images  && images.length > 0) {
      try {
        let simages =[];

        Array.from(images).forEach(file => {
          simages.push({
            'image': {
              'name': file.name,
              'size': file.size,
              'type': file.type,
              'path': 'images/stories/'+ this.state.sid + '/stages/' + this.state.ssid + '/pictures/' + file.name
            }
          });
        });
        let files = JSON.stringify(images);
        let formData = new FormData();
        for(var x = 0; x < images.length; x++) {
          formData.append('file', images[x]);
        };
        await fetch(this.state.stagePicturesUploadUrl, {
          method: 'POST',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin'},
          files: files,
          body: formData
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              this.setState({
                stage: {
                  id: this.state.stage.id,
                  sid: this.state.stage.sid,
                  name: this.state.stage.name,
                  adress: this.state.stage.adress,
                  pictures: simages,
                  images: this.state.stage.images,
                  type: this.state.stage.type,
                  description: this.state.stage.description,
                  geometry: this.state.stage.geometry,
                  stageLocation: Array.from(this.state.stage.geometry.coordinates)
                }
              });
              //this.setState({initialSValues: data});

              //let tasks = JSON.stringify(this.mergeTasks('Images', simages));
              //console.log(tasks);
              this.setState({ stagePictures: null, picturesLoading: false});
              this.getStage();

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
                images: data.images,
                videos: data.videos,
                audios: data.audios,
                type: data.type,
                description: data.description,
                geometry: data.geometry,
                stageLocation: Array.from(data.geometry.coordinates)
              }
            });

            this.setState({initialSValues: data});
            this.setState({loading: false});
            this.mergeTasks('Images', data.images);
            this.mergeTasks('Pictures', data.pictures);
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

  setStageDescription = () => {
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
    return (
      <Segment className="view" >
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get stage info</Loader>
        </Dimmer>
        <Segment>
        <StorySteps sid={this.state.sid} step={this.state.step} history={this.props.history} setSteps={this.setSteps} state={this.state}/>
        <StageBoard
          tasks={this.state.tasks}
          onDrop={this.onDrop}
          onDragStart={this.onDragStart}
          onDragOver={this.onDragOver}
          stage={this.state.stage}
          editStage={this.editStage}
          setStageLocation={this.setStageLocation}
          setStageDescription={this.setStageDescription}
          stageStep={this.state.stageStep}
          setSteps={this.setSteps}
          renderTasks={this.renderTasks}
          stageImages={this.state.stageImages}
          imagesLoading={this.state.imagesLoading}
          picturesLoading={this.state.picturesLoading}
          uploadPictures={this.uploadPictures}
          stagePictures={this.state.stagePictures}
          setStageImages= {this.setStageImages}
          setStagePictures={this.setStagePictures}
          sidebarVisible={this.state.sidebarVisible}
          topSidebarVisible={this.state.topSidebarVisible}
          handleStageStep={this.handleStageStep}
          handleShowClick={this.handleShowClick}
          handleHideClick={this.handleHideClick}
          handleSidebarHide={this.handleSidebarHide}
          handleTopHideClick={this.handleTopHideClick}
          handleTopShowClick={this.handleTopShowClick}
          handleTopSidebarHide={this.handleTopSidebarHide}
          />

      </Segment>
      </Segment>
    );
  }
}

export default stage;
