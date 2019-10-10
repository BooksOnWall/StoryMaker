import React, { Component,  createRef  } from 'react';
import {
  Segment,
  Image,
  Sidebar,
  Menu,
  Ref,
  Icon,
  Label,
  Dimmer,
  Card,
  Confirm,
  Button,
} from 'semantic-ui-react';

import { Link , withRouter} from 'react-router-dom';
import StageMap from '../map/stageMap';
import StagePictures from './stagePictures';
import StageVideos from './stageVideos';
import StageAudios from './stageAudios';
import StageImages from './stageImages';


import { Resizable } from "re-resizable";
import  ReactPlayer  from 'react-player';
import ReactAudioPlayer from 'react-audio-player';


const resizeStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  float: "left",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
};

const ObjectsPreview = (props) => {
  let objType=props.objType;
  if(objType) {
    let items = [];
    let objects = props.objValues;
    if (objects && objects.length > 0 ) {
      switch(objType) {
        case 'Images':
        items = objects.map(function(e,index){
            return <Image
              name={e.name}
              wrapped
              style={{margin: '1em'}}
              size="mini"
              id={index}
              key={"file_"+index}
              src={e.src}/>
        });
        if(objects.length >0) {
          items.push(<Button
            primary
            key='btn'
            loading={props.state.imagesLoading}
            onClick={(e) => props.uploadObjects(e, objType)}
          >Upload</Button>);
        }
        break;
        case 'Pictures':
        items = objects.map(function(e,index){
            return <Image
              name={e.name}
              wrapped
              style={{margin: '1em'}}
              size="mini"
              id={index}
              key={"file_"+index}
              src={e.src}/>
        });
        if(objects.length >0) {
          items.push(<Button
            primary
            key='btn'
            loading={props.state.picturesLoading}
            onClick={(e) => props.uploadObjects(e, objType)}
          >Upload</Button>);
        }
        break;
        case 'Videos':
        items = objects.map(function(e,index){

            return   <Segment
              inverted
              stacked
              name={'video_'+ index}
              color="green"
              key={'video_'+ index}
              style={{minHeight: '360px'}}
              onDragStart = {(e) => props.onDragStart(e, e.name)}
              draggable
              className="draggable"
              >


              <ReactPlayer
                playsinline={false}
                playing={false}
                preload={true}
                light={true}
                name={e.name}
                controls={true}
                pip={true}
                width='100%'
                height='auto'
                config={{file: {
                    attributes:  {
                      crossorigin: 'anonymous',
                    },
                    forceVideo: true
                  }
                }}
                id={"video_"+ index }
                key={"vid_"+ index }
                url={e.src}
                />

              </Segment>
        });
        if(objects.length >0) {
            items.push(<Button
              primary
              loading={props.state.videosLoading}
              onClick={(e) => props.uploadObjects(e, objType)}
            >Upload</Button>);
        }
        break;
        case 'Audios':
        items = objects.map(function(e,index){
            return   <Segment
              inverted
              name={'audios_'+ index}
              color="blue"
              key={'audio' + index}
              onDragStart = {(e) => props.onDragStart(e, e.key)}
              draggable
              className="draggable"
              >
              <ReactAudioPlayer
                name={e.name}
                src={e.src}
                key={'player_'+ index}
                controls
              />
            </Segment>
        });
        if(objects.length >0) {
          items.push(<Button
            primary
            loading={props.state.audiosLoading}
            onClick={(e) => props.uploadObjects(e, objType)}
          >Upload</Button>);
        }
        break;
        default:
        break;
      }
    }
    return items;
  }
};

class DragDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: 'overlay',
      direction: 'right',
      animation2: 'push',
      direction2: 'bottom',
      selectedIndex: null,
      loading: null,
      col1DefaultSize: { width: '25%', height: 'inherit'},
      col2DefaultSize: { width: '20%', height: 'inherit'},
      col3DefaultSize: { width: '35%', height: 'inherit'},
      col4DefaultSize: { width: '20%', height: 'inherit'},
      dimmed: null,
      import: false,
      reset: false,
      destroy: false,
      export: false,
    };

  }
  segmentRef = createRef()

  StagesNav = () => {
    return (
      <Button.Group fluid>
        {(this.props.state.prev)
          ? <Button as={Link} to={this.props.state.prev}  animated primary floated="left">
            <Button.Content  >Prev</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow left' />
            </Button.Content>
          </Button>
          : ''
        }

        <Button color="grey"><header as='h1'>{this.props.stage.name}</header></Button>
        <Button color="olive"  onClick={e => this.show('import')} ><Icon name="cloud upload" /> Import</Button>
          <Confirm
            open={this.state.import}
            cancelButton='Never mind'
            confirmButton="Let's do it"
            header="Import a stage archive"
            content="When downloaded the archive , if everything looks fine, this will erase all files and boards stage database fields only remains the location and the name of the stage before the import start to recreate all that was saved"
            onCancel={e => this.handleCancel('import')}
            onConfirm={e => this.handleConfirm('import')}
          />
        <Button.Or />
        <Button color="brown"  onClick={e => this.show('reset')} ><Icon name="erase" />Reset</Button>
          <Confirm
            open={this.state.reset}
            cancelButton='Never mind'
            confirmButton="Let's do it"
            header="Reset this stage"
            content="will be erased all files in OnZoneEnter, onPictureMatch, onZoneLeave. Same thing for the database fields OnZoneEnter, onPictureMatch, onZoneLeave"
            onCancel={e => this.handleCancel('reset')}
            onConfirm={e => this.handleConfirm('reset')}
          />
        <Button.Or />
        <Button color="red"  onClick={e => this.show('destroy')} ><Icon name="bomb" /> Destroy</Button>
          <Confirm
            open={this.state.destroy}
            cancelButton='Never mind'
            confirmButton="Let's do it"
            header="Destroy this stage"
            content="If you destroy that means that the stage and all data affiliated with it will be erased and lost forever, better think to make an export backup first"
            onCancel={e => this.handleCancel('destroy')}
            onConfirm={e => this.handleConfirm('destroy')}
          />
        <Button.Or />
        <Button color="teal" loading={this.props.state.exportLoading} onClick={e => this.show('export')}><Icon name="cloud download" /> Export</Button>
          <Confirm
            open={this.state.export}
            cancelButton='Never mind'
            confirmButton="Let's do it"
            header="Export this stage"
            content="Export will create an archive file with all files and geoJSON data, the kind of archive that you can easily import when you need it !"
            onCancel={e => this.handleCancel('export')}
            onConfirm={e => this.handleConfirm('export')}
          />

        {(this.props.state.next)
          ? <Button as={Link} to={this.props.state.next}  animated primary floated="right">
            <Button.Content  >Next</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow right' />
            </Button.Content>
          </Button>
          : ''
        }

      </Button.Group>
    )
  };
  componentDidMount = async (props) => {
    if(props && props.tasks) { this.setState({loading: true}) };
  }
  handleNavClick = async (e,url) => {
    try {
      if (url) {
        window.location.href = url;
      }
    } catch(e) {
      console.log(e.message);
    }

  }
  show = (key) => this.setState({ [key]: true })
  handleConfirm = (key) => {
    // key ['import', 'reset', 'destroy', 'export']
    this.setState({ [key]: false });
    switch(key) {
      case 'export':
      this.props.exportStage();
      break;
      default:
      break;
    }
  }

  handleCancel = (key) => this.setState({ [key]: false })
  render() {
    let tasks = this.props.renderTasks();
     return (
       <Dimmer.Dimmable as={Segment} blurring dimmed={this.state.loading}>
          <Dimmer active={this.state.loading} onClickOutside={this.handleHide} />
            <div className="container-drag">
              {(this.props.stages) ? this.StagesNav(this.props.stages, this.props.stage) : null}
              <Sidebar.Pushable as={Segment} >
                <Sidebar
                  as={Menu}
                  animation={this.state.animation2}
                  direction={this.state.direction2}
                  icon='labeled'
                  target={this.segmentRef}
                  onHide={this.props.handleTopSidebarHide}
                  visible={this.props.topSidebarVisible}
                  width='very wide'
                  style={{maxHeight: '30vh'}}
                  >
                  <Segment.Group  style={{height: 'auto', width: 'inherit'}}>
                    <Segment inverted >
                      <Button.Group >
                        <Button name="Stage" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Stage') ? true : false } >Stage</Button>
                        <Button.Or text='or' />
                        <Button name="Geo" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Geo') ? true : false }>Geo</Button>
                        <Button.Or text='or' />
                        <Button name="Images" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Images') ? true : false }>Images</Button>
                        <Button.Or text='or' />
                        <Button name="Description" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Description') ? true : false }>Description</Button>
                      </Button.Group>
                    </Segment>
                    <Segment>

                      {(this.props.stageStep === 'Stage') ? this.props.editStage() : ''}
                      {(this.props.stageStep === 'Description') ? this.props.setStageDescription() : ''}
                      {(this.props.stageStep === 'Images') ? (
                        <Segment stacked>
                          <Segment
                            className="images"
                            onDragOver={(e)=>this.props.onDragOver(e)}
                            onDrop={(e)=>{this.props.onDrop(e, "images")}}>
                            <Button className="task-header">Images</Button>
                            {tasks.images}
                          </Segment>
                          <ObjectsPreview
                            objType="Images"
                            imagesLoading={this.props.imagesLoading}
                            uploadObjects={this.props.uploadObjects}
                            state={this.props.state}
                            name="stageImages"
                            objValues={this.props.stageImages}
                            />
                          <StageImages
                            className="images"
                            setStageObjects={this.props.setStageObjects}
                            onChangeObjectsHandler={this.props.onChangeObjectsHandler}
                            />
                        </Segment> ) : ''}
                        {(this.props.stageStep === 'Geo') ? (
                          <StageMap
                            height="25vh"
                            setStageLocation={this.props.setStageLocation}
                            stageLocation={this.props.stage.stageLocation}
                            />
                        ) : ''}
                      </Segment>
                    </Segment.Group>

                  </Sidebar>
                  <Sidebar inverted
                    as={Menu}
                    animation={this.state.animation}
                    direction={this.state.direction}
                    vertical
                    style={{padding: 0}}
                    dimmed={this.state.dimmed}
                    onHide={this.props.handleSidebarHide}
                    target={this.segmentRef}
                    width='very wide'
                    visible={this.props.sidebarVisible}
                    >

                    <Button.Group>
                      <Button name="Pictures" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Pictures') ? true : false }>Pictures</Button>
                      <Button.Or text='or' />
                      <Button name="Videos" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Videos') ? true : false }>Videos</Button>
                      <Button.Or text='or' />
                      <Button name="Audios" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Audios') ? true : false }>Audios</Button>
                    </Button.Group>

                    <Segment inverted >
                      {(this.props.stageStep === 'Pictures') ? (
                        <Segment inverted
                          className="pictures"
                          onDragOver={(e)=>this.props.onDragOver(e)}
                          onDrop={(e)=>{this.props.onDrop(e, "pictures")}}>
                          <Label inverted="true" color="violet" className="task-header">Pictures</Label>
                          {tasks.pictures}

                          <ObjectsPreview
                            objType="Pictures"
                            picturesLoading={this.props.picturesLoading}
                            uploadObjects={this.props.uploadObjects}
                            state={this.props.state}
                            name="stagePictures"
                            objValues={this.props.stagePictures}
                            />
                          <StagePictures
                            className="pictures"
                            onChangeObjectHandler={this.props.onChangeObjectHandler}
                            setStageObjects={this.props.setStageObjects}/>
                        </Segment>
                      ) : ''}
                      {(this.props.stageStep === 'Videos') ? (
                        <Segment inverted
                          className="videos"
                          onDragOver={(e)=>this.props.onDragOver(e)}
                          onDrop={(e)=>{this.props.onDrop(e, "videos")}}>
                          <Label inverted="true" color="violet" className="task-header">Videos</Label>
                          {tasks.videos}

                          <StageVideos
                            className="videos"
                            onChangeObjectHandler={this.props.onChangeObjectHandler}
                            setStageObjects={this.props.setStageObjects}
                            />
                          <ObjectsPreview
                            objType="Videos"
                            videosLoading={this.props.videosLoading}
                            uploadObjects={this.props.uploadObjects}
                            state={this.props.state}
                            name="stageVideos"
                            objValues={this.props.stageVideos}
                            />
                        </Segment>
                      ) : ''}
                      {(this.props.stageStep === 'Audios') ? (
                        <Segment inverted
                          className="audios"
                          onDragOver={(e)=>this.props.onDragOver(e)}
                          onDrop={(e)=>{this.props.onDrop(e, "audios")}}>
                          <Label inverted="true" color="violet" className="task-header">Audios</Label>
                          {tasks.audios}

                          <ObjectsPreview
                            objType="Audios"
                            audiosLoading={this.props.audiosLoading}
                            uploadObjects={this.props.uploadObjects}
                            state={this.props.state}
                            name="stageAudios"
                            objValues={this.props.stageAudios}
                            />
                          <StageAudios
                            className="audios"
                            onChangeObjectHandler={this.props.onChangeObjectHandler}
                            setStageObjects={this.props.setStageObjects}
                            />

                        </Segment>
                      ) : ''}
                    </Segment>

                  </Sidebar>
                  <Sidebar.Pusher>
                    <Segment className="main-board">
                      <Ref innerRef={this.segmentRef}>
                        <Segment inverted className="board" style={{minHeight: '70vh'}} fluid="true">
                          <Resizable
                            style={resizeStyle}
                            defaultSize={this.state.col1DefaultSize}
                            >
                            <Segment inverted className="stageCol">
                              <Card.Group >
                                <Card >
                                  <Card.Content
                                    className="droppable single image"
                                    onDragOver={(e)=>this.props.onDragOver(e)}
                                    onDrop={(e)=>this.props.onDrop(e, "photo")}
                                    >
                                    <Button onClick={(e) => this.props.toggleSideBar(e, 'Images', 'bottom')} className="task-header">Photo</Button>
                                    {(tasks.photo.length > 0) ? tasks.photo : <Image  src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped  /> }
                                    <Card.Header>{this.props.stage.name}</Card.Header>
                                    <Card.Meta>Drag your image here </Card.Meta>
                                  </Card.Content>
                                </Card>
                                <Card>
                                  <Card.Content className="single"
                                    onDragOver={(e)=>this.props.onDragOver(e)}
                                    onDrop={(e)=>this.props.onDrop(e, "location")}
                                    >
                                    <Button  color="violet" onClick={(e) => this.props.toggleSideBar(e, 'Geo', 'bottom')}  className="task-header">Location</Button>
                                    {tasks.location}
                                  </Card.Content>
                                </Card>
                              </Card.Group>
                            </Segment>
                          </Resizable>
                          <Resizable
                            style={resizeStyle}
                            defaultSize={this.state.col2DefaultSize}
                            >
                            <Segment inverted className="stageCol">
                              <div className="droppable"
                                onDragOver={(e)=>this.props.onDragOver(e)}
                                onDrop={(e)=>this.props.onDrop(e, "onZoneEnter")}>
                                <Button  color="violet" onClick={(e) => this.props.toggleSideBar(e, 'Audios', 'right')} className="task-header">On Zone Enter</Button>
                                {tasks.onZoneEnter}
                              </div>
                            </Segment>
                          </Resizable>
                          <Resizable
                            style={resizeStyle}
                            defaultSize={this.state.col3DefaultSize}
                            >
                            <Segment inverted className="stageCol">
                              <div className="droppable"
                                onDragOver={(e)=>this.props.onDragOver(e)}
                                onDrop={(e)=>this.props.onDrop(e, "onPictureMatch")}>
                                <Button  color="violet" onClick={(e) => this.props.toggleSideBar(e, 'Videos', 'right')} className="task-header">On Picture Match</Button>
                                {tasks.onPictureMatch}
                              </div>
                            </Segment>
                          </Resizable>
                          <Resizable
                            style={resizeStyle}
                            defaultSize={this.state.col4DefaultSize}
                            >
                            <Segment inverted className="stageCol">
                              <div className="droppable"
                                onDragOver={(e)=>this.props.onDragOver(e)}
                                onDrop={(e)=>this.props.onDrop(e, "onZoneLeave")}>
                                <Button  color="violet" onClick={(e) => this.props.toggleSideBar(e, 'Audios', 'right')} className="task-header">On Zone Leave</Button>
                                {tasks.onZoneLeave}
                              </div>
                            </Segment>
                          </Resizable>
                        </Segment>
                      </Ref>
                    </Segment>
                  </Sidebar.Pusher>
                </Sidebar.Pushable>
              </div>
        </Dimmer.Dimmable>
      );
    };
}
export default withRouter(DragDrop);
