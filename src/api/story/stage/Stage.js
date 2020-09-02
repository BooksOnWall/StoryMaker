import React, { Component, createRef } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Form,
  Select,
  Card,
  Input,
  Label,
  Button,
  Icon,
  Checkbox,
  Confirm,
  Image,
  Progress,
  Header,
  Segment,
  Container,
  TextArea,
  Modal,
  List,
  Rating,
  Dimmer,
  Loader,
  Divider,
  TransitionablePortal,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import StorySteps from '../storySteps';
import StageBoard from './board';
import ReactPlayer  from 'react-player';
import ReactAudioPlayer from 'react-audio-player';
import ReactCardFlip from 'react-card-flip';
import StageMap from '../map/stageMap';
import LogReport from '../logReport';
import { Slider } from "react-semantic-ui-range";
import Portal from '../../../assets/images/portal.jpg';
const stageOptions = [
  { key: 'Point', value: 'Point', text: 'Geo Point' },
  { key: 'Linestring', value: 'Linestring', text: 'Line String' }
];
const sceneOptions = [
  { key: 1, value: 1, text: 'Video inside Picture' },
  { key: 2, value: 2, text: 'Video aside anchored picture' },
  { key: 3, value: 3, text: 'Video aside anchored with multiple pictures' },
  { key: 4, value: 4, text: 'Portal' },
  { key: 5, value: 5, text: 'Picture inside Video' },
  { key: 6, value: 6, text: 'Pictures inside Video' },
  { key: 7, value: 7, text: '3D Scene' }
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
const PIV = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePosition, sceneType, meters2pixels, alignItems}) => {
  return (<>
    <div style={{position: 'absolute', left: '50px', bottom: '60px', minHeight: meters2pixels(dimension.split('x')[1])+'px', minWidth: meters2pixels(dimension.split('x')[0])+'px', zIndex: 1001}}>
      {dimension && picture && (videoPosition.mode === "left" || videoPosition.mode === "top")  &&
        <div style={{width: meters2pixels(dimension.split('x')[0])+'px', alignSelf: alignItems, marginTop: picturePosition.top, marginBottom: picturePosition.bottom}}>
          <Image src={picture.src} />
        </div>
      }
    </div>
    {video &&
      <div style={{width: '100%', marginLeft: meters2pixels(videoPosition.left), marginTop: meters2pixels(videoPosition.top), marginRight: meters2pixels(videoPosition.right), marginBottom: meters2pixels(videoPosition.bottom)}} className="draggable">
        <ReactPlayer
          playsinline={true}
          playing={video.autoplay}
          preload="false"
          light={false}
          name={video.name}
          muted={false}
          controls={true}
          loop={video.loop}
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

        id={"video_position" }
        key={"vid_position" }
        url={video.src}
      />
      </div>

    }


    </>);
}
const VIP = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePosition, sceneType, meters2pixels, alignItems}) => {
  return (
    <>
    <Image src={picture.src} style={{position: 'absolute', top: '10vh', zIndex: 998}}/>
      <div style={{position: 'absolute', top: '10vh', zIndex: 999}}>
        <ReactPlayer
          playsinline={true}
          playing={video.autoplay}
          preload="true"
          light={false}
          name={video.name}
          muted={false}
          controls={true}
          loop={video.loop}
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

        id={"video_position" }
        key={"vid_position" }
        url={video.src}
      />
      </div>
      </>
  );
}
const PAV = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePosition, sceneType, meters2pixels, alignItems}) => {
  return (<>
    {dimension && picture && (videoPosition.mode === "left" || videoPosition.mode === "top")  &&
      <div style={{width: meters2pixels(dimension.split('x')[0])+'px', alignSelf: alignItems, marginTop: picturePosition.top, marginBottom: picturePosition.bottom}}>
        <Image src={picture.src} />
      </div>
    }
    {video &&
      <div style={{width: '40%', marginLeft: meters2pixels(videoPosition.left), marginTop: meters2pixels(videoPosition.top), marginRight: meters2pixels(videoPosition.right), marginBottom: meters2pixels(videoPosition.bottom)}} className="draggable">
        <ReactPlayer
          playsinline={true}
          playing={video.autoplay}
          preload="true"
          light={false}
          name={video.name}
          muted={false}
          controls={true}
          loop={video.loop}
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

        id={"video_position" }
        key={"vid_position" }
        url={video.src}
      />
      </div>

    }
    {dimension && picture && (videoPosition.mode === "right" || videoPosition.mode === "bottom" ) &&
      <div style={{width: meters2pixels(dimension.split('x')[0]), alignSelf: alignItems, marginTop: picturePosition.top, marginBottom: picturePosition.bottom}} className="draggable">
        <Image src={picture.src} />
      </div>
    }
  </>)
}
const WallCanvas = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePosition, sceneType}) =>  {
  const meters2pixels = (meters) => (meters*30);
  const display = (videoPosition.mode === 'left' || videoPosition.mode === 'right') ? 'flex' : 'block';
  const alignItems = (videoPosition.mode === 'left' || videoPosition.mode === 'right') ? 'flex-end' : 'start';
  const justifyContent = (videoPosition.mode === 'left' || videoPosition.mode === 'right') ? 'initial' : 'center';
  return (
    <Segment style={{justifyContent: justifyContent, alignItems: alignItems, minHeight: '35vh', display: display, flexWrap: 'wrap'}}>
      {(sceneType === 1) && <VIP meters2pixels={meters2pixels} alignItems={alignItems} dimension={dimension} picture={picture} video={video} videoPosition={videoPosition} picturePosition={picturePosition} handlePositionChange={handlePositionChange} savePosition={savePosition} sceneType={sceneType}/>}
      {(sceneType === 2  || sceneType === 3) && <PAV meters2pixels={meters2pixels} alignItems={alignItems} dimension={dimension} picture={picture} video={video} videoPosition={videoPosition} picturePosition={picturePosition} handlePositionChange={handlePositionChange} savePosition={savePosition} sceneType={sceneType}/>}
      {(sceneType === 5 || sceneType === 6) && <PIV meters2pixels={meters2pixels} alignItems={alignItems} dimension={dimension} picture={picture} video={video} videoPosition={videoPosition} picturePosition={picturePosition} handlePositionChange={handlePositionChange} savePosition={savePosition} sceneType={sceneType}/>}
      {(sceneType === 4) && <Image src={Portal} style={{maxWidth: '70vw', maxHeight: '30vh'}}/>

      }
    </Segment>
  );
};
const PivConfig = ({picturePosition,handlePicturePosition, leftSettings, rightSettings, handleBlur, topSettings, bottomSettings }) => {
  return (
    <div>
    {(picturePosition.mode === 'left' || picturePosition.mode === 'bottom' || picturePosition.mode === 'top') &&
      <>
      <Input
        fluid
        inverted
        transparent
        label='Left'
        placeholder='Left'
        type="text"
        name="left"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'left')}
        onBlur={e => handleBlur}
        value={picturePosition.left}
        />
      <Slider color="grey" name="left" value={picturePosition.left} primary settings={leftSettings} />
      </>
    }
    {(picturePosition.mode === 'right' || picturePosition.mode === 'bottom' || picturePosition.mode === 'top') &&
      <>
      <Input
        fluid
        inverted
        transparent
        label='Right'
        placeholder='Right'
        type="text"
        name="right"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'right')}
        onBlur={e => handleBlur}
        value={picturePosition.right}
        />
      <Slider color="grey" name="right" value={picturePosition.right} primary settings={rightSettings} />
      </>
    }
    {(picturePosition.mode === 'top' ) &&
      <>
      <Input
        fluid
        inverted
        transparent
        label='Top'
        placeholder='Top'
        type="text"
        name="top"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'top')}
        onBlur={e => handleBlur}
        value={picturePosition.top}
        />
      <Slider color="grey" name="top" value={picturePosition.top} primary settings={topSettings} />
      </>
    }
    {(picturePosition.mode === 'left' || picturePosition.mode === 'right' || picturePosition.mode === 'bottom') &&
       <>
        <Input
          fluid
          inverted
          transparent
          label='Bottom'
          placeholder='Bottom'
          type="text"
          name="bottom"
          onChange={e => handlePicturePosition(e.currentTarget.value, 'bottom')}
          onBlur={e => handleBlur}
          value={picturePosition.bottom}
          />
        <Slider color="grey" name="bottom" value={picturePosition.bottom} primary settings={bottomSettings} />
      </>
    }
  </div>
  );
}
const VideoConfig = ({stage, videoPosition, picturePosition, animation, duration, open, handleBlur, leftSettings, rightSettings, topSettings, bottomSettings, handleVideoPosition, handlePicturePosition, switchVideoPosition, switchPicture, toggleArType, switchArType, saveVideoposition, pIndex}) => {
  const positionOptions = [
    { key: 'left', value: 'left', text: 'Left' },
    { key: 'right', value: 'right', text: 'Right' },
    { key: 'top', value: 'top', text: 'Top' },
    { key: 'bottom', value: 'bottom', text: 'Bottom' }
  ];

  const pictures = stage.pictures.map((p,i) => {
    p.text = "Picture "+(i+1);
    p.value = i;
      return p;
  });

  return (
    <TransitionablePortal
     open={open}
     transition={{ animation, duration }}
   >
    <>
     <Segment
       inverted
       style={{
         width: '80vw',
         height: 'auto',
         maxHeight: '70vh',
         left: '10%',
         overflowY: 'auto',
         position: 'fixed',
         top: '10vh',
         zIndex: 1000,
       }}
     >
       <Header as="h4" style={{display: 'flex', justifyContent: 'space-between',flexWrap: 'no-wrap'}}>Video position configuration

         <Select
           inverted
           transparent
           placeholder='Ar Type'
           options={sceneOptions}
           name="arType"
           label='AR Type'
           type="select"
           onChange={(e, {value}) => switchArType(e, value, 'scene_type')}
           onBlur={e => handleBlur}
           defaultValue={stage.scene_type}
           />
         {(pictures.length > 1) && (stage.scene_type === 3  || stage.scene_type === 6) &&
           <Select
             inverted
             transparent
             placeholder='Picture'
             options={pictures}
             name="pictures"
             label='Pictures'
             type="select"
             onChange={(e, {value}) => switchPicture(e, value, 'picture_switch')}
             onBlur={e => handleBlur}
             defaultValue={pictures[pIndex].value}
             />
         }
         {(stage.scene_type === 2  || stage.scene_type === 3) &&
           <Select
             inverted
             transparent
             placeholder='Video position'
             options={positionOptions}
             name="videoPosition"
             label='Video Position'
             type="select"
             onChange={(e, {value}) => switchVideoPosition(e, value, 'video_position')}
             onBlur={e => handleBlur}
             defaultValue={videoPosition.mode}
             />
         }
       </Header>
       {stage.scene_type > 0 &&
         <WallCanvas
           sceneType={stage.scene_type}
           dimension={stage.dimension}
           picturePosition={picturePosition}
           videoPosition={videoPosition}
           picture={(stage && stage.pictures && stage.pictures.length > 0) ? stage.pictures[pIndex] : null}
           video={(stage && stage.onPictureMatch && stage.onPictureMatch.length > 0) ? stage.onPictureMatch[0] : null}
           />
       }

       <Segment inverted style={{width:'45vw',display: 'flex', justifyContent: 'space-between',flexWrap: 'nowrap'}}>
         <div >
           <Header inverted as="h6">Image Position</Header>
           <label>Picture Dimension: {stage.dimension}</label>
           {(stage.scene_type  === 5 || stage.scene_type  === 6) && <PivConfig picturePosition={picturePosition} handlePicturePosition={handlePicturePosition} leftSettings={leftSettings} rightSettings={rightSettings} handleBlur={handleBlur} topSettings={topSettings} bottomSettings={bottomSettings}/> }

         </div>
         <div style={{width:'25vw'}} >
           <Header inverted as="h6">Video Position in meters</Header>
           {(videoPosition.mode === 'left' || videoPosition.mode === 'bottom' || videoPosition.mode === 'top') &&
             <>
             <Input
               fluid
               inverted
               transparent
               label='Left'
               placeholder='Left'
               type="text"
               name="left"
               onChange={e => handleVideoPosition(e.currentTarget.value, 'left')}
               onBlur={e => handleBlur}
               value={videoPosition.left}
               />
             <Slider color="grey" name="left" value={videoPosition.left} primary settings={leftSettings} />
             </>
           }
           {(videoPosition.mode === 'right' || videoPosition.mode === 'bottom' || videoPosition.mode === 'top') &&
             <>
             <Input
               fluid
               inverted
               transparent
               label='Right'
               placeholder='Right'
               type="text"
               name="right"
               onChange={e => handleVideoPosition(e.currentTarget.value, 'right')}
               onBlur={e => handleBlur}
               value={videoPosition.right}
               />
             <Slider color="grey" name="right" value={videoPosition.right} primary settings={rightSettings} />
             </>
           }
           {(videoPosition.mode === 'top' ) &&
             <>
             <Input
               fluid
               inverted
               transparent
               label='Top'
               placeholder='Top'
               type="text"
               name="top"
               onChange={e => handleVideoPosition(e.currentTarget.value, 'top')}
               onBlur={e => handleBlur}
               value={videoPosition.top}
               />
             <Slider color="grey" name="top" value={videoPosition.top} primary settings={topSettings} />
             </>
           }
            {(videoPosition.mode === 'left' || videoPosition.mode === 'right' || videoPosition.mode === 'bottom') &&
              <>
               <Input
                 fluid
                 inverted
                 transparent
                 label='Bottom'
                 placeholder='Bottom'
                 type="text"
                 name="bottom"
                 onChange={e => handleVideoPosition(e.currentTarget.value, 'bottom')}
                 onBlur={e => handleBlur}
                 value={videoPosition.bottom}
                 />
               <Slider color="grey" name="bottom" value={videoPosition.bottom} primary settings={bottomSettings} />
             </>
        }
       </div>
       </Segment>
         <Segment inverted  style={{display: 'flex', justifyContent: 'space-between',flexWrap: 'no-wrap'}}>
           <Button secondary onClick={e=> toggleArType()}>close</Button>
           <Button primary onClick={e=> saveVideoposition()}>Save</Button>
         </Segment>
   </Segment>

   </>
   </TransitionablePortal>
  );

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
        mode: (parseInt(this.props.match.params.sid) === 0) ? ('create') : ('update'),
        name: null,
        stages: null,
        stagesURI: server + 'stories/' + parseInt(this.props.match.params.id) +'/stages',
        stageURL: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid),
        stageImagesUploadUrl: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid) + '/uploadImages',
        stagePicturesUploadUrl: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid) + '/uploadPictures',
        stageVideosUploadUrl: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid) + '/uploadVideos',
        stageAudiosUploadUrl: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid) + '/uploadAudios',
        preflightStageURL: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid) + '/preflight',
        downloadStageURL : server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.sid) + '/download',
        map:  '/stories/'+ this.props.match.params.id  + '/map',
        loading: false,
        step: 'Stages',
        isFlipped: false,
        animation: 'slide along',
        direction: 'right',
        dimmed: null,
        open: false,
        duration: 500,
        descLock: false,
        stageStep: 'Stage',
        confirm: false,
        tasks: [],
        sidebarVisible: false,
        topSidebarVisible: false,
        stage: {
          id: null,
          sid: parseInt(this.props.match.params.id),
          ssid: parseInt(this.props.match.params.sid),
          name: '',
          adress: '',
          photo: null,
          images: null,
          pictures: null,
          description: null,
          dimension: null,
          radius: null,
          videos: null,
          audios: null,
          onZoneEnter: null,
          onPictureMatch: null,
          onZoneLeave: null,
          stageOrder: null,
          percent: null,
          type: 'Point',
          scene_type: 0,
          geometry: {
            "type": "Point",
            "coordinates": [-56.1670182, -34.9022229  ]
          },
          stageLocation: [-56.1670182, -34.9022229  ],
        },
        index: null,
        prev: null,
        next: null,
        stageDelete: false,
        objDelUrl: server + 'Stories/'+ this.props.match.params.id + '/stages/' + this.props.match.params.sid + '/objDelete',
        objMvUrl: server + 'Stories/'+ this.props.match.params.id + '/stages/' + this.props.match.params.sid + '/objMv',
        objChangePropUrl: server + 'Stories/'+ this.props.match.params.id + '/stages/' + this.props.match.params.sid + '/objChangeProp',
        imagesLoading: false,
        picturesLoading: false,
        videosLoading: false,
        audiosLoading: false,
        exportLoading: false,
        downloadLoading:  false,
        saveDescLoading: false,
        stagePictures: [],
        stageImages: [],
        stageVideos: [],
        stageAudios: [],
        videoDefaultSize: '350',
        videoPosition: {
          width: 100,
          height: 100,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          rotateAngle: 0,
          mode: 'left' // display video according to its position vs picture
        },
        picturePosition: {
          width: 100,
          height: 100,
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          rotateAngle: 0,
          mode: 'bottom'
        },
        leftSettings : {
          start: 0,
          min: 0,
          max: 10,
          step: .01,
          onChange: value => this.handleVideoPosition(value, 'left')
        },
        rightSettings : {
          start: 0,
          min: 0,
          max: 10,
          step: .01,
          onChange: value => this.handleVideoPosition(value, 'right')
        },
        topSettings : {
          start: 0,
          min: 0,
          max: 10,
          step: .01,
          onChange: value => this.handleVideoPosition(value, 'top')
        },
        bottomSettings : {
          start: 0,
          min: 0,
          max: 10,
          step: .01,
          onChange: value => this.handleVideoPosition(value, 'bottom')
        },
        pIndex: 0,
        preflightModal: false,
        preflightLog: null,
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
      this.togglePictureLock = this.togglePictureLock.bind(this);
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
  handleStages = async () => {
    try {
      await fetch(this.state.stagesURI, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({ stages: data });
            return this.handleStageNav(data, this.state.stage);
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
  handleStageNav = (stages , stage) => {
    // get only first render with stages datas
    let index = (stages && stage ) ? stages.map(function(e) { return parseInt(e.id); }).indexOf(parseInt(stage.sid)) : null ;
    if (stages && stage && index && index > -1  ) {
      const prevIndex = index -1;
      const nextIndex = index + 1;
      let prev = stages[prevIndex].id;
      let next = stages[nextIndex].id;
      let url = "/stories/" + this.state.stage.sid + "/stages/";
      let prevUrl = (prev) ? (url + prev) : null;
      let nextUrl = (next) ? (url + next) : null;
      if (prevUrl && nextUrl) {
        this.setState({index: index, prev: prevUrl, next: nextUrl});
      }
    }
    return true;

  }
  toggleSideBar = (e, step , bar) => {
    (bar ==='bottom')
    ? this.setState({
      stageStep: step,
      sidebarVisible: false,
      topSidebarVisible: true,
    })
    : this.setState({
      stageStep: step,
      sidebarVisible: true,
      topSidebarVisible: false,
    });

  }
  handleObjectDelete = async (e, t) => {
    try {
      let tasks= this.state.tasks;
      //close confirm modal
      const index = tasks.findIndex(el => (el.category === t.category && el.name === t.name));
      let confirm = (tasks[index].confirm === false) ? true : false;
      tasks[index].confirm = confirm;
      // update tasks
      this.setState({tasks: tasks});
      // send delete request to server
      await fetch(this.state.objDelUrl, {
        method: 'delete',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body:JSON.stringify({ id: this.state.ssid, sid: this.state.sid, obj: t })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
        if(data) {
          //remove object from this.state.tasks
          tasks = tasks.filter(function( obj ) {
            return obj.name !== t.name;
          });
          this.setState({tasks: tasks});
          // reload stage
          return this.getStage();
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

  handleObjectDeleteConfirm = (e, t) => {
    let tasks= this.state.tasks;
    const index = tasks.findIndex(el => (el.category === t.category && el.name === t.name));
    let confirm = (tasks[index].confirm === false) ? true : false;
    tasks[index].confirm = confirm;
    this.setState({tasks: tasks});
  }
  handleObjectDeleteCancel = (e, t) => {
    let tasks= this.state.tasks;
    const index = tasks.findIndex(el => (el.category === t.category && el.name === t.name));
    tasks[index].confirm = false;
    this.setState({tasks: tasks});
  }
  handleDelete = async () => {
    //delete stage
    try {

        await fetch(this.state.stageURL, {
          method: 'delete',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
          body:JSON.stringify({ id: this.state.ssid, sid: this.state.sid })
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
          if(data) {
            this.setState({stageDelete: false});
            // redirect to user edit page
            this.props.history.push('/stories/'+ this.state.sid + '/stages');
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
  handleCancel = () => this.setState({ confirm: false })
  handleHideClick = () => this.setState({ sidebarVisible: false })
  handleShowClick = () => this.setState({ sidebarVisible: true })
  handleSidebarHide = () => this.setState({ sidebarVisible: false })
  handleTopHideClick = () => this.setState({ topSidebarVisible: false })
  handleTopShowClick = () => this.setState({ topSidebarVisible: true })
  handleTopSidebarHide = () => this.setState({ topSidebarVisible: false })
  stageDeleteShow = () => this.setState({stageDelete: true})
  handleDeleteCancel = () => this.setState({stageDelete: false})
  lock = () => this.setState({descLock: true})
  unlock = () => this.setState({descLock: false})
  toggleLock = () => (this.state.descLock === true) ? this.unlock() : this.lock()
  togglePictureLock = () => (this.state.pictureLock === true) ? this.setState({pictureLock: false}) : this.setState({pictureLock: true})
  setSteps = (e) => this.setState(e)
  onDrop = async (ev, cat) => {
    // move object from category
    try {
      console.log('drop');
      let id = ev.dataTransfer.getData("id");
      let obj ={};
      let newObj={};
      let old;
      // change category
      let tasks = this.state.tasks.filter((task) => {
        if(task.name === id) {
          old = task.category;
          obj = task;
          task.category = cat ;
          //extract newObj
          newObj = task;
        }
        return task;
      });
      newObj.category=cat;

      // send request to server to move file from directory
      if(old !== newObj.category) {
        // uri objMvUrl
        await fetch(this.state.objMvUrl, {
          method: 'PATCH',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
          body:JSON.stringify({
            id: this.state.ssid,
            sid: this.state.sid,
            old: old,
            obj: obj,
            newObj : newObj
          })
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
          if(data) {
            //return new object with new src path
            tasks = this.state.tasks.filter((task) => {
              if(task.name === id) {
                // dimmed.blur element stop
                task.loading = !task.loading;
                //return new path
                task.src = data.obj.src;
                task.path = data.obj.path;
              }
              return task;
            });
            this.setState({
                ...this.state,
                tasks
            });
            console.log('drag terminated');
          }
        })
        .catch((error) => {
          // Your error is here!
          console.log(error)
        });

      }
    } catch(e) {
      console.log(e.message);
    }
  }
  onDragStart = (ev, id) => {
      ev.dataTransfer.setData("id", id);
      // dimmed.blur element
      this.toggleObjectDimmed(ev, id);
  }
  setStageLocation = (lngLat) => {
    this.setState({stage: {
      id: this.state.stage.id,
      sid: this.state.stage.sid,
      ssid: this.state.stage.ssid,
      name: this.state.stage.name,
      adress: this.state.stage.adress,
      dimension: this.state.stage.dimension,
      radius: this.state.stage.radius,
      photo: this.state.stage.photo,
      images: this.state.stage.images,
      pictures: this.state.stage.pictures,
      videos: this.state.stage.videos,
      audios: this.state.stage.audios,
      onZoneEnter: this.state.stage.onZoneEnter,
      onPictureMatch: this.state.stage.onPictureMatch,
      onZoneLeave: this.state.stage.onZoneLeave,
      type: this.state.stage.type,
      scene_type: this.state.stage.scene_type,
      description: this.state.stage.description,
      geometry: {
        "type": "Point",
        "coordinates": lngLat
      },
      stageLocation: lngLat
    }});
  }
  toggleObjectDimmed = (ev, id) => {
    console.log(id);
    let ntasks = [];
    ntasks = this.state.tasks.filter((task) => {
      task.loading = (task.name === id) ? !task.loading : task.loading;

      return task;
    });
    console.log(ntasks);
    this.setState({tasks: ntasks})
  }
  onDragOver = (ev) => {
      ev.preventDefault();

  }
  changePropFromObject = async (obj, prop, propValue) => {
    try {
      if(obj && obj.name) {
        await fetch(this.state.objChangePropUrl, {
          method: 'PATCH',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
          body:JSON.stringify({
            id: this.state.ssid,
            sid: this.state.sid,
            obj: obj,
            prop : prop,
            propValue: propValue
          })
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
          if(data) {
            return data.obj;
          }
        })
        .catch((error) => {
          // Your error is here!
          console.log(error)
        });
      }

    } catch(e) {
      console.log(e.message);
    }
  }
  handleLoopChange = async (e, b) => {
    try {
      let ntasks = [];
      let obj ;
      this.state.tasks.forEach(function(task) {
        if (task.name === b.name) obj = task ;
        task.loop = (task.name !== b.name) ? task.loop : b.checked;
        ntasks.push(task);
      });
      // update server db
      await this.changePropFromObject(obj, 'loop', b.checked);
      // update tasks
      await this.setState({tasks: ntasks});
    } catch(e) {
      console.log(e.message);
    }
  }
  handleSeekChange = e => {
    // wrong need to refer to attribute played of the object
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
              name={'image_'+index}
              key={'img_'+index}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className={'draggable image ' + t.category}
              style={{height: 'auto', padding:0, margin:0}}
              >
              <Dimmer.Dimmable as={Segment} blurring dimmed={t.loading}>
                <Dimmer active={t.loading} onClickOutside={this.handleHide} />
                  <ReactCardFlip style={{height: 'auto', width: '100px'}} isFlipped={t.isFlipped} flipDirection="horizontal">
                    <Card className="fluid" key="front">
                      <Image
                        wrapped={(t.category ==='Images') ? true : null}
                        className={t.category}
                        size={(t.category ==='Images') ? 'small': null}
                        name={t.name}
                        key={t.name}
                        src={t.src}
                        style={{padding:0, margin:0}}
                        />
                      <Label className="inverted">
                        <Icon className="button left floated" floated="left" name="edit" onClick={(e) => this.handleCardClick(e,t)} />
                        <Icon className="button right floated" floated="right" name="trash alternate"  onClick={(e) => this.handleObjectDeleteConfirm(e,t)} />
                        <Confirm
                          content='Are you sure you want to delete this ??? '
                          open={t.confirm}
                          cancelButton='Never mind'
                          confirmButton="Yes ! let's destroy it !"
                          onCancel={(e) => this.handleObjectDeleteCancel(e,t)}
                          onConfirm={(e) => this.handleObjectDelete(e,t)}
                          />

                      </Label>
                    </Card>
                    <Card fluid key="back">
                      <Form style={{textAlign: 'left'}}>
                        <Button fluid primary onClick={(e) => this.handleCardClick(e,t)}><Icon name="arrow left" /> Back</Button>
                        <Label.Group color='blue' style={{padding: '2em'}}>
                          <Label  className="inverted">
                            Name:
                            <Label.Detail>{t.name}</Label.Detail>
                          </Label>
                          <Label  className="inverted">
                            Size:
                            <Label.Detail>{humanFileSize(t.size)}</Label.Detail>
                          </Label>
                          <Label  className="inverted">Url:
                            <Label.Detail><Button href={t.src}>Source</Button></Label.Detail>
                          </Label>
                        </Label.Group>
                      </Form>

                    </Card>
                  </ReactCardFlip>
              </Dimmer.Dimmable>
            </Segment>
          );
          break;
          case 'picture':
          tasks[t.category].push(
            <Segment
              inverted
              color="blue"
              name={'picture_'+index}
              key={'pic_'+index}
              style={{height: 'auto', width: '160px', padding:'.5em'}}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="draggable picture"
              >
              <Dimmer.Dimmable as={Segment} blurring dimmed={t.loading}>
                <Dimmer active={t.loading} onClickOutside={this.handleHide} />
              <ReactCardFlip style={{height: 'auto', width: 'inherit'}} isFlipped={t.isFlipped} flipDirection="horizontal">
                <Card className="fluid" key="front">
                  <Image
                    wrapped={(t.category === 'Pictures') ? true : null}
                    size={(t.category === 'Pictures') ? 'mini': null}
                    name={t.name}
                    src={t.src}
                    key={t.name}
                    />
                  <Label  className="inverted">
                    <Icon className="button left floated" floated="left"  name="edit" onClick={(e) => this.handleCardClick(e,t)} />
                    <Icon className="button right floated" floated="right" name="trash alternate"  onClick={(e) => this.handleObjectDeleteConfirm(e,t)} />
                    <Confirm
                      content='Are you sure you want to delete this ??? '
                      open={t.confirm}
                      cancelButton='Never mind'
                      confirmButton="Yes ! let's destroy it !"
                      onCancel={(e) => this.handleObjectDeleteCancel(e,t)}
                      onConfirm={(e) => this.handleObjectDelete(e,t)}
                      />
                    {t.name}: {humanFileSize(t.size)}
                  </Label>
                </Card>
                <Card fluid key="back">
                  <Form style={{textAlign: 'left'}}>
                      <Button primary onClick={(e) => this.handleCardClick(e,t)}><Icon name="arrow left" /> Back</Button>
                    <Label.Group inverted style={{padding: '2em'}}>
                      <Label as='a'  className="inverted">
                        Name:
                        <Label.Detail>{t.name}</Label.Detail>
                      </Label>
                      <Label as='a'  className="inverted">
                        Size:
                        <Label.Detail>{humanFileSize(t.size)}</Label.Detail>
                      </Label>
                      <Label as='a'  className="inverted">Url:
                        <Label.Detail><Button href={t.src}>Source</Button></Label.Detail>
                      </Label>
                    </Label.Group>
                  </Form>

                </Card>
              </ReactCardFlip>
              </Dimmer.Dimmable>
          </Segment>
          );
          break;
          case 'audio':
          tasks[t.category].push(
            <Segment
              inverted
              name={t.name}
              key={index}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="audio draggable"
              >
              <Dimmer.Dimmable as={Segment} blurring dimmed={t.loading}>
                <Dimmer active={t.loading} onClickOutside={this.handleHide} />
              <ReactCardFlip style={{height: 'auto', backgroundColor: 'transparent' , width: 'inherit'}} isFlipped={t.isFlipped} flipDirection="vertical">
                <Card  color='blue' className="fluid" key="front" style={{ backgroundColor: 'transparent' }}>
                  <Label  className="inverted">
                    {t.name} <span className="right floated">{humanFileSize(t.size)}</span>
                  </Label>
                  <ReactAudioPlayer
                    src={t.src}
                    autoPlay={t.autoplay}
                    className= {'audioPreview'}
                    loop={t.loop}
                    controls
                    />
                    <Label  className="inverted">
                    <Icon className="button left floated" floated="left"  name="edit" onClick={(e) => this.handleCardClick(e,t)} />
                    <Icon className="button right floated" floated="right" name="trash alternate"  onClick={(e) => this.handleObjectDeleteConfirm(e,t)} />
                      <Confirm
                        content='Are you sure you want to delete this ??? '
                        open={t.confirm}
                        cancelButton='Never mind'
                        confirmButton="Yes ! let's destroy it !"
                        onCancel={(e) => this.handleObjectDeleteCancel(e,t)}
                        onConfirm={(e) => this.handleObjectDelete(e, t)}
                      />
                    </Label>
                </Card>
                <Card color='blue' fluid key="back" >
                  <Form style={{textAlign: 'left'}}>
                    <Button fluid primary onClick={(e) => this.handleCardClick(e,t)}><Icon name="arrow left" /> Back</Button>
                    <Label.Group color='blue' style={{padding: '2em'}}>
                      <Label  className="inverted">
                        Name:
                        <Label.Detail>{t.name}</Label.Detail>
                      </Label>
                      <Label  className="inverted">
                        Size:
                        <Label.Detail>{humanFileSize(t.size)}</Label.Detail>
                      </Label>
                      <Label  className="inverted">Url:
                        <Label.Detail><Button href={t.src}>Source</Button></Label.Detail>
                      </Label>
                      <Checkbox
                        label="Use as a loop"
                        name={t.name}
                        checked={t.loop}
                        defaultValue={t.loop}
                        toggle
                        onChange={this.handleLoopChange}/>
                    </Label.Group>
                  </Form>
                </Card>
              </ReactCardFlip>
            </Dimmer.Dimmable>
            </Segment>
          );
          break;
          case 'video':
          tasks[t.category].push(
            <Segment
              inverted
              name={'video_'+index}
              key={'video'+index}
              style={{height: 'auto', width: 'inherit'}}
              onDragStart = {(e) => this.onDragStart(e, t.name)}
              draggable
              className="draggable video"
              >
              <Dimmer.Dimmable as={Segment} blurring dimmed={t.loading}>
                <Dimmer active={t.loading} onClickOutside={this.handleHide} />
                <ReactCardFlip style={{height: 'auto', backgroundColor: 'transparent' , width: 'inherit'}} isFlipped={t.isFlipped} flipDirection="vertical">
                  <Card className="fluid" style={{ backgroundColor: 'transparent' }} key="front">
                  <Label  className="inverted" fluid>
                    {t.name} <span className="right floated">{humanFileSize(t.size)}</span>
                  </Label>
                      <ReactPlayer
                      playsinline={true}
                      playing={t.autoplay}
                      preload="true"
                      light={false}
                      name={t.name}
                      muted={false}
                      ref={this.ref}
                      controls={true}
                      loop={t.loop}
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

                  <Label  className="inverted" >
                    <Icon className="button left floated" floated="left"  name="edit" onClick={(e) => this.handleCardClick(e,t)} />
                    <Icon className="button right floated" floated="right" name="trash alternate"  onClick={(e) => this.handleObjectDeleteConfirm(e,t)} />
                    <Confirm
                      content='Are you sure you want to delete this ??? '
                      open={t.confirm}
                      cancelButton='Never mind'
                      confirmButton="Yes ! let's destroy it !"
                      onCancel={(e) => this.handleObjectDeleteCancel(e,t)}
                      onConfirm={(e) => this.handleObjectDelete(e,t)}
                      />
                  </Label>
                </Card>
                <Card fluid key="back" >
                  <Form style={{textAlign: 'left'}}>
                    <Button fluid primary onClick={(e) => this.handleCardClick(e,t)}><Icon name="arrow left" /> Back</Button>
                    <Label.Group style={{padding: '2em'}}>
                      <Label  className="inverted">
                        Name:
                        <Label.Detail>{t.name}</Label.Detail>
                      </Label>
                      <Label  className="inverted">
                        Size:
                        <Label.Detail>{humanFileSize(t.size)}</Label.Detail>
                      </Label>
                      <Label  className="inverted">Url:
                        <Label.Detail><Button href={t.src}>Source</Button></Label.Detail>
                      </Label>
                      <Button primary onClick={(e) => this.toggleArType()}>set video position</Button>
                      <Checkbox label="Use as a loop"
                        name={t.name}
                        checked={t.loop}
                        defaultValue={t.loop}
                        toggle
                        onChange={this.handleLoopChange}/>
                    </Label.Group>
                  </Form>
                </Card>
              </ReactCardFlip>
            </Dimmer.Dimmable>
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
      switch(cat) {
        case 'Images':
        let imageArray =[];
        list.forEach(function(image) {
          let json = {
            name: image.name,
            type: image.type,
            size: image.size,
            isFlipped: false,
            category: image.category,
            confirm: false,
            loading: false,
            path: image.path,
            src: image.src
          };
          imageArray.push(json);
        });
        tasks = tasks.concat(imageArray);
        break;
        case 'Pictures':
        let picturesArray =[];
        list.forEach(function(image) {
          let json = {
            name: image.name,
            type: image.type,
            category: image.category,
            size: image.size,
            confirm: false,
            loading: false,
            isFlipped: false,
            path: image.path,
            src: image.src
          };
          picturesArray.push(json);
        });
        tasks = tasks.concat(picturesArray);
        break;
        case 'Videos':
        let videosArray =[];
        list.forEach(function(video) {
          let json = {
            name: video.name,
            type: video.type,
            category: video.category,
            isFlipped: false,
            autoplay: false,
            confirm: false,
            loading: false,
            loop: false,
            size: video.size,
            path: video.path,
            src: video.src
          };
          videosArray.push(json);
        });
        tasks = tasks.concat(videosArray);
        break;
        case 'Audios':
        let audiosArray =[];
        list.forEach(function(audio) {
          let json = {
            name: audio.name,
            type: audio.type,
            category:audio.category,
            confirm: false,
            loading: false,
            loop: false,
            autoplay: false,
            isFlipped: false,
            size: audio.size,
            path: audio.path,
            src: audio.src
          };
          audiosArray.push(json);
        });
        tasks = tasks.concat(audiosArray);
        break;
        case 'photo':
        let photoArray =[];
        list.forEach(function(photo) {
          let json = photo;
          photoArray.push(json);
        });
        tasks = tasks.concat(photoArray);
        break;
        case 'onZoneEnter':
        let ozeArray =[];
        list.forEach(function(oze) {
          ozeArray.push(oze);
        });
        tasks = tasks.concat(ozeArray);
        break;
        case 'onPictureMatch':
        let opmArray =[];
        list.forEach(function(opm) {
          opmArray.push(opm);
        });
        tasks = tasks.concat(opmArray);
        break;
        case 'onZoneLeave':
        let ozlArray =[];
        list.forEach(function(ozl) {
          ozlArray.push(ozl);
        });
        tasks = tasks.concat(ozlArray);
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
        dimension: this.state.stage.dimension,
        radius: this.state.stage.radius,
        images: this.state.stage.images,
        pictures: this.state.stage.pictures,
        videos: this.state.stage.videos,
        audios: this.state.stage.audios,
        photo: this.state.stage.photo,
        onZoneEnter: this.state.stage.onZoneEnter,
        onPictureMatch: this.state.stage.onPictureMatch,
        onZoneLeave: this.state.stage.onZoneLeave,
        type: this.state.stage.type,
        scene_type: this.state.stage.scene_type,
        description: this.state.stage.description,
        geometry: this.state.stage.geometry,
        stageLocation: lngLat
      }
    });
  }
  ref = player => this.player = player
  onChangeObjectsHandler = (e, target) => this.setState({[target]: e.files})
  setStageObjects = (e, target) => this.setState({[target]: e})

  componentDidMount = async () => {
    try {
      if(parseInt(this.props.match.params.sid) === 0) {
        // create stage

      } else {
        // update stage
        await this.getStage();
      }

    } catch(e) {
      console.log(e.message);
    }
  }

  handleAnimationChange = (animation) => () => this.setState((prevState) => ({ animation, visible: !prevState.visible }))
  handleDimmedChange = (e, { checked }) => this.setState({ dimmed: checked })
  handleDirectionChange = (direction) => () => this.setState({ direction, visible: false })
  createStage = async (values) => {
    try  {
      await fetch(this.state.stagesURI +'/'+ 0, {
        method: 'post',
        credentials: 'same-origin',
        headers: {'Access-Control-Allow-Origin': '*',  'Content-Type':'application/json'},
        body:JSON.stringify({
          id: this.state.stage.id,
          sid: this.state.stage.sid,
          ssid: this.state.stage.ssid,
          name: this.state.stage.name,
          adress:this.state.stage.adress,
          dimension: this.state.stage.dimension,
          radius: this.state.stage.radius,
          photo: this.state.stage.photo,
          images: this.state.stage.images,
          pictures: this.state.stage.pictures,
          videos: this.state.stage.videos,
          audios: this.state.stage.audios,
          onZoneEnter: this.state.stage.onZoneEnter,
          onPictureMatch: this.state.stage.onPictureMatch,
          onZoneLeave: this.state.stage.onZoneLeave,
          type: this.state.stage.type,
          scene_type: this.state.stage.scene_type,
          stageOrder: this.state.stage.stageOrder,
          description: this.state.stage.description,
          geometry: this.state.stage.geometry,
          stageLocation: this.state.stage.stageLocation
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // redirect to user edit page
            this.props.history.push('/stories/' + this.state.sid + '/stages' );
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
  updateStage = async (values) => {
    try {
      await fetch(this.state.stagesURI +'/'+ this.state.ssid, {
        method: 'post',
        credentials: 'same-origin',
        headers: {'Access-Control-Allow-Origin': '*',  'Content-Type':'application/json'},
        body:JSON.stringify({
          id: this.state.stage.id,
          sid: this.state.stage.sid,
          ssid: this.state.stage.ssid,
          name: this.state.stage.name,
          adress:this.state.stage.adress,
          dimension: this.state.stage.dimension,
          radius: this.state.stage.radius,
          photo: this.state.stage.photo,
          images: this.state.stage.images,
          pictures: this.state.stage.pictures,
          videos: this.state.stage.videos,
          audios: this.state.stage.audios,
          onZoneEnter: this.state.stage.onZoneEnter,
          onPictureMatch: this.state.stage.onPictureMatch,
          onZoneLeave: this.state.stage.onZoneLeave,
          type: this.state.stage.type,
          scene_type: this.state.stage.scene_type,
          stageOrder: this.state.stage.stageOrder,
          description: this.state.stage.description,
          geometry: this.state.stage.geometry,
          stageLocation: this.state.stage.stageLocation
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // redirect to user edit page
            this.setState({topSidebarVisible: false});
            this.props.history.push('/stories/' + this.state.sid + '/stages/'+this.state.ssid );
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
  handleBlur = () =>  true;
  switchArType = (e, value, name) => {
    if(value !== 1) this.setState({open: true});
    return this.handleChange(e, value, name);
  }
  switchPicture = (e, value, name) => {
    this.setState({pIndex: value});
  }
  switchVideoPosition = (e, value, name) => {
    let {videoPosition} = this.state;
    videoPosition.left =0;
    videoPosition.right =0;
    videoPosition.top =0;
    videoPosition.bottom =0;
    videoPosition.mode= value;
    this.setState({videoPosition});
  }
  handleVideoPosition = (value, field ) => {
    let {videoPosition} = this.state;
    videoPosition[field] = value;
    this.setState({videoPosition});
  }
  handlePicturePosition = (value, field ) => {
    let {picturePosition} = this.state;
    picturePosition[field] = value;
    this.setState({picturePosition});
  }
  toggleArType = () => this.setState({open: !this.state.open})
  handleChange = (e, value, name) => {
    this.setState({
      stage: {
        id: this.state.stage.id,
        sid: this.state.stage.sid,
        ssid: this.state.stage.ssid,
        name: (e.target.name === 'name') ? e.target.value : this.state.stage.name,
        adress: (e.target.name === 'adress') ? e.target.value : this.state.stage.adress,
        description: (e.target.name === 'description') ? e.target.value : this.state.stage.description,
        dimension: (e.target.name === 'dimension') ? e.target.value : this.state.stage.dimension,
        radius: (e.target.name === 'radius') ? e.target.value : this.state.stage.radius,
        photo: this.state.stage.photo,
        images: this.state.stage.images,
        pictures: this.state.stage.pictures,
        stageOrder: this.state.stage.stageOrder,
        videos: this.state.stage.videos,
        audios: this.state.stage.audios,
        onZoneEnter: this.state.stage.onZoneEnter,
        onPictureMatch: this.state.stage.onPictureMatch,
        onZoneLeave: this.state.stage.onZoneLeave,
        type: (value && name === 'type') ? value : this.state.stage.type,
        scene_type: (value && name === 'scene_type') ? value : this.state.stage.scene_type,
        geometry: this.state.stage.geometry,
        stageLocation: (e.target.name === 'stageLocation') ? e.target.value : this.state.stage.stageLocation
      }
    });
  }
  updateStageDescription = async () => {
    try {
      this.setState({saveDescLoading: true});
      const desc = document.getElementById("StageDesc").value;
      // this.setState({stage: {
      //   ...stage, description: desc
      // }})
      await fetch(this.state.stagesURI +'/'+ this.props.match.params.sid, {
        method: 'post',
        credentials: 'same-origin',
        headers: {'Access-Control-Allow-Origin': '*',  'Content-Type':'application/json'},
        body:JSON.stringify({
          id: this.state.stage.id,
          sid: this.state.stage.sid,
          ssid: this.state.stage.ssid,
          name: this.state.stage.name,
          adress:this.state.stage.adress,
          dimension: this.state.stage.dimension,
          radius: this.state.stage.radius,
          photo: this.state.stage.photo,
          images: this.state.stage.images,
          pictures: this.state.stage.pictures,
          videos: this.state.stage.videos,
          audios: this.state.stage.audios,
          onZoneEnter: this.state.stage.onZoneEnter,
          onPictureMatch: this.state.stage.onPictureMatch,
          onZoneLeave: this.state.stage.onZoneLeave,
          type: this.state.stage.type,
          scene_type: this.state.stage.scene_type,
          description: desc,
          geometry: this.state.stage.geometry,
          stageLocation: this.state.stage.stageLocation
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // redirect to user edit page
            this.setState({saveDescLoading: false});
            this.toggleLock();
            this.getStage();
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log(error)
      });
      console.log('desc',desc);
    } catch(e) {
      console.log(e.message);
    }
  }


  editStage = () => {
    let { animation, duration, open , stage, videoPosition, picturePosition, leftSettings, rightSettings, topSettings, bottomSettings, pIndex} = this.state;
    return (
          <Formik
            enableReinitialize={true}
            initialValues={this.state.stage}
            validate={values => {
              let errors = {};
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              if(this.state.mode === 'update') {
                this.updateStage(values);
              } else {
                this.createStage(values);
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
              <Form inverted onSubmit={this.handleSubmit}>
                <Segment inverted style={{marginTop:'15px'}}>
                <Input
                  fluid
                  inverted
                  transparent
                  placeholder='Name'
                  label='Name'
                  autoFocus={true}
                  type="text"
                  name="name"
                  onChange={e => this.handleChange(e)}
                  onBlur={e => handleBlur}
                  defaultValue={values.name}
                  />
                {errors.name && touched.name && errors.name}
                <Divider />
                  <Input
                  fluid
                  inverted
                  transparent
                  placeholder='calle, barrio, ciudad, pays'
                  label='Adress'
                  type="text"
                  name="adress"
                  onChange={e  => this.handleChange(e)}
                  onBlur={e => handleBlur}
                  defaultValue={values.adress}
                  />
                {errors.adress && touched.adress && errors.adress}
                <Divider />
                  <Input
                  fluid
                  inverted
                  transparent
                  placeholder='en meter ex: 1.5x2.5'
                  label='Dimension'
                  type="text"
                  name="dimension"
                  onChange={e => this.handleChange(e)}
                  onBlur={e => handleBlur}
                  defaultValue={values.dimension}
                  />
                {errors.dimension && touched.dimension && errors.dimension}
                <Divider />
                  <Input
                  fluid
                  inverted
                  transparent
                  placeholder='en meter ex: 50'
                  label='Radius'
                  type="text"
                  name="radius"
                  onChange={e => this.handleChange(e)}
                  onBlur={e => handleBlur}
                  defaultValue={values.radius}
                  />
                {errors.radius && touched.radius && errors.radius}
                <Divider />
                  <Input
                  fluid
                  inverted
                  transparent
                  label='Stage Location'
                  placeholder='Stage Location'
                  type="text"
                  name="stagelocation"
                  onChange={e => this.handleChange(e)}
                  onBlur={e => handleBlur}
                  value={JSON.stringify(this.state.stage.stageLocation)}
                  />
                {errors.stagelocation && touched.stagelocation && errors.stagelocation}
                <Divider />
                <Label size='large' className='label inverted' fluid >Stage type</Label>
                <Select
                  fluid
                  inverted
                  transparent
                  placeholder='Stage type'
                  label='Stage type'
                  type="select"
                  name="type"
                  onChange={(e, {value}) => this.handleChange(e, value, 'type')}
                  onBlur={e => handleBlur}
                  options={stageOptions}
                  defaultValue={values.type}
                  />
                {errors.stagetype && touched.stagetype && errors.stagetype}
                <Divider />
                <Label size='large' className='label inverted' fluid >Ar Scene type</Label>
                <Select
                  fluid
                  inverted
                  transparent
                  placeholder='Ar Scene type'
                  label='Ar Scene type'
                  type="select"
                  name="scene_type"
                  onChange={(e, {value}) => this.switchArType(e, value, 'scene_type')}
                  onBlur={e => handleBlur}
                  options={sceneOptions}
                  defaultValue={values.scene_type}
                  />
                <VideoConfig
                  stage={stage}
                  videoPosition={videoPosition}
                  picturePosition={picturePosition}
                  animation={animation}
                  duration={duration}
                  open={open}
                  pIndex={pIndex}
                  switchArType={this.switchArType}
                  switchPicture={this.switchPicture}
                  saveVideoposition={this.saveVideoposition}
                  toggleArType={this.toggleArType}
                  handlePicturePosition={this.handlePicturePosition}
                  handleVideoPosition={this.handleVideoPosition}
                  switchVideoPosition={this.switchVideoPosition}
                  handleBlur={this.handleBlur}
                  leftSettings={leftSettings}
                  rightSettings={rightSettings}
                  topSettings={topSettings}
                  bottomSettings={bottomSettings}
                  />

                {errors.scene_type && touched.scene_type && errors.scene_type}
                <Divider />
                <Button onClick={handleSubmit} floated='right' primary  size='large' type="submit" disabled={isSubmitting}>
                  {(this.state.mode === 'create') ? 'Create' : 'Update'}
                </Button>
                {(this.state.mode === 'update') ? (
                  <div>
                    <Button onClick={this.stageDeleteShow} color='red' floated='left' size='large' type="submit" disabled={isSubmitting}>
                      <FormattedMessage id="app.story.stage.delete" defaultMessage={`Delete stage`}/>
                    </Button>
                    <Confirm
                      open={this.state.stageDelete}
                      cancelButton='Never mind'
                      confirmButton="Delete Stage"
                      onCancel={this.handleDeleteCancel}
                      onConfirm={this.handleDelete}
                      />
                  </div>
                ) : '' }
                </Segment>
              </Form>
            )}
          </Formik>
    );
  }

  uploadObjects = async (e, objType) => {
      //objType === [images, videos, pictures, audios]
      let loadingState = objType.toLowerCase() + 'Loading';
      console.log(loadingState);
      let stageObject = 'stage'+[objType];
      let objectName = objType.toLowerCase();

      this.setState({ [loadingState] : true});
      let objects = this.state[stageObject];

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
                    dimension: this.state.stage.dimension,
                    radius: this.state.stage.radius,
                    pictures: (objType === 'Pictures') ? sobjects : this.state.stage.pictures ,
                    images: (objType === 'Images') ? sobjects : this.state.stage.images,
                    videos: (objType === 'Videos') ? sobjects : this.state.stage.videos,
                    audios: (objType === 'Audios') ? sobjects : this.state.stage.audios,
                    photo: this.state.stage.photo,
                    onZoneEnter: this.state.stage.onZoneEnter,
                    onPictureMatch: this.state.stage.onPictureMatch,
                    onZoneLeave: this.state.stage.onZoneLeave,
                    type: this.state.stage.type,
                    scene_type: this.state.stage.scene_type,
                    description: this.state.stage.description,
                    geometry: this.state.stage.geometry,
                    stageLocation: Array.from(this.state.stage.geometry.coordinates)
                  }
                });
                this.setState({ [stageObject]: null, [loadingState]: false, tasks: []});
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
  exportStage = async () => {
    try {
      this.setState({exportLoading: true});
      await this.checkPreflight();
    } catch(e) {
      console.log(e.message);
    }

  }
  checkPreflight = async () => {
    try {
      await fetch(this.state.preflightStageURL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Access-Control-Allow-Origin': '*' },
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({exportLoading: false, preflightModal: true, preflightLog: data.preflight});
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log({error});
      });
    } catch(e) {
      console.log(e.message);
    }
  }
  getStage = async () => {
    this.setState({loading: true});
    this.setState({tasks: []});
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
            console.log(data);
            this.setState({
              stage: {
                id: data.id,
                sid: data.sid,
                name: data.name,
                adress: data.adress,
                dimension: data.dimension,
                radius: data.radius,
                photo: data.photo,
                pictures: data.pictures,
                images: data.images,
                videos: data.videos,
                audios: data.audios,
                onZoneEnter: data.onZoneEnter,
                onPictureMatch: data.onPictureMatch,
                onZoneLeave: data.onZoneLeave,
                type: data.type,
                scene_type: data.scene_type,
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
            this.mergeTasks('photo', data.photo);
            this.mergeTasks('onZoneEnter', data.onZoneEnter);
            this.mergeTasks('onPictureMatch', data.onPictureMatch);
            this.mergeTasks('onZoneLeave', data.onZoneLeave);
            console.log(data.pictures);
            return data;
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log({error})
      });
      await this.handleStages();
    } catch(e) {
      console.log(e.message);
    }
  }

  setStageDescription = () => (
    <ReactCardFlip id="stageDesc" style={{backgroundColor: 'transparent', height: 'auto', width: '100%'}}  isFlipped={this.state.descLock} flipDirection="vertical">
          <Container className="desc" inverted fluid key="front" style={{ padding:0 }}>
            <Form>
            {this.state.stage.description}
            </Form>
          </Container>
          <Container className="desc transparent" inverted fluid key="back" style={{ padding:0 }}>

            <Form fluid style={{display: 'inherit', width: '100%' }}>
              <TextArea
                rows={2}
                id="StageDesc"
                className="desc-edit"
                name="description"
                placeholder='Description'
                defaultValue={this.state.stage.description}
                style={{width: '100%'}}
              />
             <Icon className="button left floated" floated="left" name="save outline"  onClick={this.updateStageDescription}  />
          </Form>
          </Container>
        </ReactCardFlip>
  )
  setStagePictures = () => {
    const {stage} = this.state;
    const picture = (stage.pictures && stage.pictures.length > 0) ? stage.pictures[0] : null;
    if (picture) return (
      <ReactCardFlip id="stagePicture" style={{backgroundColor: 'transparent', height: 'auto', width: '100%'}}  isFlipped={this.state.pictureLock} flipDirection="vertical">
        <Container className="desc" inverted fluid key="front" style={{ padding:0 }}>
          <Modal trigger={<Image fluid src={picture.src} />}>
            <Modal.Header image><Image fluid src={picture.src} /></Modal.Header>
          </Modal>
        </Container>
        <Container className="desc transparent" inverted fluid key="back" style={{ padding:0 }}>
          <Form fluid style={{display: 'inherit', width: '100%' }}>
            <Label fluid as='a' color='blue' image>
              <Image src={picture.src} />
              {picture.name}
            </Label>
            <Divider />
            <Label fluid as='a' color='violet'>MimeType: {picture.mimetype}</Label>
            <Label fluid as='a' color='green' >Size: {humanFileSize(picture.size)}</Label>
             {(picture.rating) ? <Label as='a' color='green'>ArcoreImg rating: <Rating icon='star' defaultRating={(picture.rating/10)} maxRating={10} disabled/>{picture.rating}</Label> : <Label as='a' color='red'>ArcoreImg Rank: {(picture.rank) ? picture.rank : 'unset'}</Label>}
             <Button primary onClick={e=> this.toggleArType()}>set video position</Button>
             <Divider />
            <Icon className="button left floated" floated="left" name="save outline"  onClick={this.updateStagePicture}  />
          </Form>
        </Container>
      </ReactCardFlip>
    )
  }
  handleStageStep = (e) => this.setState({stageStep: e.target.name})
  handleExport = () => {
    this.setState({preflightModal: false});
  }
  handleDownload = async () => {
    try {
      this.setState({downloadLoading: true});
      await fetch(this.state.downloadStageURL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Access-Control-Allow-Origin': '*' },
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({downloadLoading: false, preflightModal: false});
            window.location.href = this.state.server + data.export.src;
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log({error});
      });
    } catch(e) {

    }

  }
  logReport = () => {
    const logs = (this.state.preflightLog) ? this.state.preflightLog : null;
    if (logs) {
      return (
        <List>{logs.map((line) => (<List.Item>{line.condition}</List.Item>))}</List>
      );
    }

  }
  percentPreflight = (p) => {
    if (p) {
      let win = 0;
      let err = 0;
      let total = 0;
      p.map(log => (log.check === true) ? win ++ : err ++);
      total = (win + err);
      return parseInt((win / total) * 100);
    }
  }
  render() {
      return (
        <Container className="main stageBoard" fluid>
        <Segment inverted className="view" >
          <Modal inverted className='preflight'
            open={this.state.preflightModal}
            onClose={this.handleExport}
            basic
            size='small'
            >

            <Header inverted icon='tasks' content='Preflight Check ' />
            <Segment inverted>
            <Segment inverted><Progress  percent={this.percentPreflight(this.state.preflightLog)} progress active indicating inverted size='medium' /></Segment>
            <Modal.Content>
              <h3>Below a check before exporting.</h3>
              <LogReport logs={this.state.preflightLog}/>
            </Modal.Content>
            </Segment>
            <Modal.Actions>
              <Button color='red' basic onClick={this.handleExport}><Icon name='triangle left' /> Back </Button>
              <Button basic color='green' onClick={this.handleDownload} loading={this.state.downloadLoading}><Icon name='cloud download' /> Download Stage </Button>
            </Modal.Actions>
            </Modal>
          <Dimmer.Dimmable inverted as={Segment} blurring dimmed={this.state.loading}>
            <Dimmer active={this.state.loading} onClickOutside={this.handleHide} />
            <Loader className='loader' active={this.state.loading} >Get stage info</Loader>
            <Header as={Segment} vertical size='medium'>
            {(this.state.mode === 'create') ? <FormattedMessage id="app.story.stage.title.create" defaultMessage={`Story: Create stage`}/> : <FormattedMessage id="app.story.stage.title.edit" defaultMessage={`Story: Edit Stage`}/> }
            </Header>

            <StorySteps sid={this.state.sid} step={this.state.step} history={this.props.history} setSteps={this.setSteps} state={this.state}/>
            {/* Create stage and set location case */}
            {(this.state.ssid === 0) ?
              <Segment.Group horizontal style={{height: '70vh'}}>
                <Segment style={{height: 'inherit', width: '150px'}}>{this.editStage()}</Segment>
                <Segment style={{height: 'inherit'}}>{(this.state.ssid === 0 ) ? <StageMap height="70vh" sid={this.state.sid} mode={this.state.mode} setStageLocation={this.setStageLocation} stageLocation={this.state.stage.stageLocation} geometry={this.props.geometry} viewport={this.props.viewport}
                /> : ''}</Segment>
              </Segment.Group>
            : ''}

            {/* Update stage and reality augmented control board */}
            {(this.state.stages) ? <StageBoard
              history={this.props.history}
              tasks={this.state.tasks}
              onDrop={this.onDrop}
              onDragStart={this.onDragStart}
              onDragOver={this.onDragOver}
              state={this.state}
              stage={(this.state.stage) ? this.state.stage :  null }
              stages={this.state.stages}
              editStage={this.editStage}
              setStageLocation={this.setStageLocation}
              setStageDescription={this.setStageDescription}
              setStagePictures={this.setStagePictures}
              stageStep={this.state.stageStep}
              setSteps={this.setSteps}
              renderTasks={this.renderTasks}
              getStage={this.getStage}
              uploadObjects={this.uploadObjects}
              setStageObjects={this.setStageObjects}
              onChangeObjectsHandler={this.onChangeObjectsHandler}
              toggleLock = {this.toggleLock}
              togglePictureLock = {this.togglePictureLock}
              toggleSideBar = {this.toggleSideBar}
              stageImages={this.state.stageImages}
              toggleArType={this.toggleArType}
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
              exportStage={this.exportStage}
              />
            : ''
                }
        </Dimmer.Dimmable>
        </Segment>
        </Container>
      );
  }
}

export default withRouter(stage);
