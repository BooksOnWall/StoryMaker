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
  Image,
  Segment,
  TextArea,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import StorySteps from '../storySteps';
import StageBoard from './board';
import ReactHtmlParser from 'react-html-parser';
import ReactPlayer  from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import ReactCardFlip from 'react-card-flip';


const stageOptions = [
  { key: 'Point', value: 'Point', text: 'Geo Point' },
  { key: 'linestring', value: 'linestring', text: 'Line String' },
  { key: 'audio', value: 'audio', text: 'Audio' }
];


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
        stageVideosUploadUrl: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid) + '/uploadVideos',
        stageAudiosUploadUrl: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid) + '/uploadAudios',
        map:  '/stories/'+ this.props.match.params.id  + '/map',
        loading: null,
        step: 'Stages',
        isFlipped: false,
        animation: 'slide along',
        direction: 'right',
        dimmed: null,
        descLock: 'lock',
        stageStep: 'Stage',
        tasks: [],
        sidebarVisible: false,
        topSidebarVisible: false,
        stage: {
          id: null,
          sid: this.props.match.params.id,
          ssid: parseInt(this.props.match.params.id),
          name: '',
          adress: '',
          images: null,
          pictures: null,
          videos: null,
          audios: null,
          type: null,
          description: '',
          geometry: null,
          stageLocation: null
        },
        imagesLoading: false,
        picturesLoading: false,
        videosLoading: false,
        audiosLoading: false,
        stagePictures: [],
        stageImages: [],
        stageVideos: [],
        stageAudios: [],
        videoDefaultSize: '350',
        setSteps: this.setSteps,
        setStageLocation: this.setStageLocation,
        toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
        authenticated: this.props.childProps.authenticated,
      };
      this.handleCardClick = this.handleCardClick.bind(this);
      this.mergeTasks = this.mergeTasks.bind(this);
      this.setSteps = this.setSteps.bind(this);
      this.getStage= this.getStage.bind(this);
      this.lock=this.lock.bind(this);
      this.unlock=this.unlock.bind(this);
      this.toggleLock = this.toggleLock.bind(this);
  }

  segmentRef = createRef()
  handleCardClick(e, t) {
    e.preventDefault();
    const index = this.state.tasks.findIndex(el => (el.category === t.category && el.name === t.name));
    let flipped = (this.state.tasks[index].isFlipped === false) ? true : false;
    let tasks = this.state.tasks;
    tasks[index].isFlipped = flipped;
    this.setState({tasks: tasks});

  }
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
      ev.dataTransfer.setData("id", id);
  }

  onDragOver = (ev) => {
      ev.preventDefault();
  }
  handleSeekChange = e => {
    this.setState({ played: parseFloat(e.target.value) })
  }
  renderTasks = () => {
    var tasks = {
      title: [],
      photo: [],
      description: [],
      location: [],
      wip: [],
      pictures: [],
      videos: [],
      audios: [],
      images: [],
      editStage: [],
      onZoneEnter: [],
      onPictureMatch: [],
      onZoneLeave: []
    };
    if (this.state.tasks) {
      this.state.tasks.forEach ((t, index) => {
        switch(t.type) {
          case 'text':
          tasks[t.category].push(
            <Segment
              inverted
              name={t.name}
              color="orange"
              key={index}
              onDragStart = {(e) => this.onDragStart(e, t.key)}
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
            <Segment
              inverted
              color="violet"
              name={'image_'+index}
              key={'img_'+index}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="draggable image"
              style={{height: 'auto', width: 'inherit'}}
              >
            <Image
              wrapped
              name={t.name}
              key={t.name}
              src={t.src}
              />
              <Button  size="mini" primary floated="left"><Icon  name="edit" /></Button>
              <Button  size="mini" primary floated="right"><Icon  name="delete" /></Button>
            <Label inverted="true" color="violet">{t.name}:{humanFileSize(t.size)}</Label>
            </Segment>
          );
          break;
          case 'picture':
          tasks[t.category].push(
            <Segment
              inverted
              color="violet"
              name={'picture_'+index}
              key={'pic_'+index}
              style={{height: 'auto', width: 'inherit'}}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="draggable picture"
              >

            <Image
              wrapped
              name={t.name}
              key={t.name}
              />
              <Button  size="mini" primary floated="left"><Icon  name="edit" /></Button>
              <Button  size="mini" primary floated="right"><Icon  name="delete" /></Button>
              <Label inverted="true" color="violet">{t.name}:{humanFileSize(t.size)}</Label>
          </Segment>
          );
          break;
          case 'video':

          tasks[t.category].push(
            <Segment
              inverted
              color="violet"
              name={'video_'+index}
              key={'video'+index}
              style={{height: 'auto', width: 'inherit'}}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="draggable video"
              >
              <ReactCardFlip style={{height: 'auto', width: 'inherit'}} isFlipped={t.isFlipped} flipDirection="vertical">
                <Card className="fluid" key="front">
                  <ReactPlayer
                    playsinline={true}
                    playing={false}
                    preload="true"
                    light={true}
                    name={t.name}
                    muted={false}
                    ref={this.ref}
                    controls={true}
                    loop={false}
                    width='100%'
                    height='auto'
                    pip={true}
                    seeking="true"
                    config={{file: {
                        attributes:  {
                          crossOrigin: 'anonymous',
                          width: '100%',
                          height: 'auto'
                        },
                        forceVideo: true
                      }
                    }}

                    id={"video_"+ index }
                    key={"vid_"+ index }
                    url={t.src}
                    />

                <Label inverted="true" color="violet" >
                  <Button  size="mini" primary floated="left" onClick={(e) => this.handleCardClick(e,t)} ><Icon  name="edit" /></Button>
                  <Button  size="mini" primary floated="right"><Icon  name="delete" /></Button>
                  {t.name}: {humanFileSize(t.size)}
                </Label>


                </Card>

                <Card fluid key="back">
                  This is the back of the card.
                  <Button primary onClick={(e) => this.handleCardClick(e,t)}>Click to flip</Button>
                </Card>
              </ReactCardFlip>

            </Segment>

          );
          break;
          case 'audio':
          console.log(t);
          tasks[t.category].push(
            <Segment
              inverted
              curved
              name={t.name}
              color="blue"
              key={index}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="audio draggable"
              >
              <ReactCardFlip style={{height: 'auto', width: 'inherit'}} isFlipped={t.isFlipped} flipDirection="vertical">
                <Card  className="fluid" key="front">
                  <Label inverted="true" color="violet">
                    <Button  size="mini" primary floated="left" onClick={(e) => this.handleCardClick(e,t)}><Icon  name="edit" /></Button>
                    <Button  size="mini" primary floated="right"><Icon  name="delete" /></Button>
                    {t.name}: {humanFileSize(t.size)}
                  </Label>
                  <ReactAudioPlayer
                    src={t.src}
                    controls
                    />
                </Card>
                <Card fluid key="back">
                  This is the back of the card.
                  <Button primary onClick={(e) => this.handleCardClick(e,t)}>Click to flip</Button>
                </Card>
              </ReactCardFlip>

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
      let server = this.state.server;
      switch(cat) {
        case 'Images':
        let imageArray =[];
        list.forEach(function(image) {
          let img = image.image;
          let json = {
            name: img.name,
            type: "image",
            size: img.size,
            isFlipped: false,
            category:"images",
            src: server + img.src
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
            size: img.size,
            isFlipped: false,
            src: server + img.src
          };
          picturesArray.push(json);
        });
        tasks = tasks.concat(picturesArray);
        break;
        case 'Videos':
        let videosArray =[];
        list.forEach(function(video) {
          let vid = video.video;
          let json = {
            name: vid.name,
            type: "video",
            category:"videos",
            isFlipped: false,
            loop: false,
            size: vid.size,
            src: server + vid.src
          };
          videosArray.push(json);
        });
        tasks = tasks.concat(videosArray);
        break;
        case 'Audios':
        let audiosArray =[];
        list.forEach(function(audio) {
          let a = audio.audio;
          let json = {
            name: a.name,
            type: "audio",
            category:"audios",
            loop: false,
            isFlipped: false,
            size: a.size,
            src: server + a.src
          };
          audiosArray.push(json);
        });
        tasks = tasks.concat(audiosArray);
        break;
        default:
        break;
      }
      this.setState({tasks:tasks});

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
        images: this.state.stage.images,
        pictures: this.state.stage.pictures,
        videos: this.state.stage.videos,
        audios: this.state.stage.audios,
        type: this.state.stage.type,
        description: this.state.stage.description,
        geometry: this.state.stage.geometry,
        stageLocation: lngLat
      }
    });
  }
  ref = player => this.player = player
  onChangeObjectsHandler = (e, target) => this.setState({[target]: e.files})
  setStageObjects = (e, target) => this.setState({[target]: e})

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

  uploadObjects = async (e, objType) => {
    console.log(objType);
    console.log(e);
    console.log('clicked');

      //objType === [images, videos, pictures, audios]
      let loadingState = objType.toLowerCase() + 'Loading';
      let stageObject = 'stage'+[objType];
      let objectName = objType.toLowerCase();
      let object = objType.toLowerCase().substring(0, -1);
      console.log(object);
      this.setState({ [loadingState] : true});
      let objects = this.state[stageObject];
      console.log(objects);
      let url=null;
      switch(objType) {
        case 'Images':
        url=this.state.stageImagesUploadUrl;
        break;
        case 'Pictures':
        url=this.state.stagePicturesUploadUrl;
        break;
        case 'Videos':
        url=this.state.stageVideosUploadUrl;
        break;
        case 'Audios':
        url=this.state.stageAudiosUploadUrl;
        break;
        default:
        break;
      }
      if (objects  && objects.length > 0) {
        try {
          let sobjects =[];

          Array.from(objects).forEach(file => {
            sobjects.push({
              object : {
                'name': file.name,
                'size': file.size,
                'type': file.type,
                'src': 'images/stories/'+ this.state.sid + '/stages/' + this.state.ssid + '/' + objectName + '/' + file.name
              }
            });
          });
          let files = JSON.stringify(objects);
          let formData = new FormData();
          for(var x = 0; x < objects.length; x++) {
            formData.append('file', objects[x]);
          };
          await fetch(url, {
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
                    pictures: (objType === 'Pictures') ? sobjects : this.state.stage.pictures ,
                    images: (objType === 'Images') ? sobjects : this.state.stage.images,
                    videos: (objType === 'Videos') ? sobjects : this.state.stage.videos,
                    audios: (objType === 'Audios') ? sobjects : this.state.stage.audios,
                    type: this.state.stage.type,
                    description: this.state.stage.description,
                    geometry: this.state.stage.geometry,
                    stageLocation: Array.from(this.state.stage.geometry.coordinates)
                  }
                });
                this.setState({ [stageObject]: null, [loadingState]: false});
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
      //this.setState({ [loadingState] : false});
      console.log(objects);
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
            this.mergeTasks('Videos', data.videos);
            this.mergeTasks('Audios', data.audios);
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

          uploadObjects={this.uploadObjects}
          setStageObjects={this.setStageObjects}
          onChangeObjectsHandler={this.onChangeObjectsHandler}

          stageImages={this.state.stageImages}
          stagePictures={this.state.stagePictures}
          stageVideos={this.state.stageVideos}
          stageAudios={this.state.stageAudios}

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
