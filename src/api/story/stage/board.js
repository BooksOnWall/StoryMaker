import React, { Component,  createRef  } from 'react';
import {
  Segment,
  Image,
  Sidebar,
  Menu,
  Ref,
  Icon,
  Dimmer,
  Confirm,
  Button,
  Modal,
  Grid,
  Header,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
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
  border: "solid 3px transparent",
  background: "transparent"
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
              style={{minHeight: '80px', maxWidth: '192px'}}
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

const picturesContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  minWidth: '55vw',
  marginTop: 0
};
class DragDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      animation: 'push',
      direction: 'bottom',
      animation2: 'overlay',
      direction2: 'right',
      selectedIndex: null,
      loading: null,
      col2DefaultSize: { width: '30%', height: 'inherit'},
      col3DefaultSize: { width: '40%', height: 'inherit'},
      col4DefaultSize: { width: '30%', height: 'inherit'},
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
    <Segment className="StagesNav">
        <Button.Group inverted basic>
        <Button primary basic floated='left' onClick={(e) => this.props.toggleSideBar(e, 'Stage', 'bottom')} className="task-header ">
        <Icon name="edit" /> <FormattedMessage id="app.story.board.edit" defaultMessage={`Edit`}/></Button>
        <Button disabled basic compact onClick={e => this.show('import')} ><Icon name="cloud upload" /> <FormattedMessage id="app.story.board.import" defaultMessage={`Import`}/></Button>
          <Confirm
            open={this.state.import}
            cancelButton='Never mind'
            confirmButton="Let's do it"
            header="Import a stage archive"
            content="When downloaded the archive , if everything looks fine, this will erase all files and boards stage database fields only remains the location and the name of the stage before the import start to recreate all that was saved"
            onCancel={e => this.handleCancel('import')}
            onConfirm={e => this.handleConfirm('import')}
          />
        <Button basic compact loading={this.props.state.exportLoading} onClick={e => this.show('export')}><Icon name="cloud download" /> <FormattedMessage id="app.story.board.export" defaultMessage={`Export`}/></Button>
          <Confirm
            open={this.state.export}
            cancelButton='Never mind'
            confirmButton="Let's do it"
            className="exportMessage"
            header="Export this stage"
            content="Export will create an archive file with all files and geoJSON data, the kind of archive that you can easily import when you need it !"
            onCancel={e => this.handleCancel('export')}
            onConfirm={e => this.handleConfirm('export')}
          />
        <Button disabled basic compact onClick={e => this.show('reset')} ><Icon name="erase" /><FormattedMessage id="app.story.board.reset" defaultMessage={`Reset`}/></Button>
          <Confirm
            open={this.state.reset}
            cancelButton='Never mind'
            confirmButton="Let's do it"
            header="Reset this stage"
            content="will be erased all files in OnZoneEnter, onPictureMatch, onZoneLeave. Same thing for the database fields OnZoneEnter, onPictureMatch, onZoneLeave"
            onCancel={e => this.handleCancel('reset')}
            onConfirm={e => this.handleConfirm('reset')}
          />
        <Button disabled basic compact onClick={e => this.show('destroy')} ><Icon name="bomb" /> <FormattedMessage id="app.story.board.destroy" defaultMessage={`Destroy`}/></Button>
          <Confirm
            open={this.state.destroy}
            cancelButton='Never mind'
            confirmButton="Let's do it"
            header="Destroy this stage"
            content="If you destroy that means that the stage and all data affiliated with it will be erased and lost forever, better think to make an export backup first"
            onCancel={e => this.handleCancel('destroy')}
            onConfirm={e => this.handleConfirm('destroy')}
          />
        </Button.Group>
        <br /><br />
      <Button.Group className="navStage">
        {(this.props.state.prev)
          ? <Button disabled compact as={Link} to={this.props.state.prev}  animated primary floated="left">
            <Button.Content  ><FormattedMessage id="app.story.board.preview" defaultMessage={`Preview`}/></Button.Content>
            <Button.Content hidden>
              <Icon name='arrow left' />
            </Button.Content>
          </Button>
          : ''
        }
        {(this.props.state.next)
          ? <Button compact disabled as={Link} to={this.props.state.next}  animated primary floated="right">
            <Button.Content><FormattedMessage id="app.story.board.next" defaultMessage={`Next`}/></Button.Content>
            <Button.Content hidden>
              <Icon name='arrow right' />
            </Button.Content>
          </Button>
          : ''
        }
        </Button.Group>
    </Segment>
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
       <Dimmer.Dimmable inverted as={Segment} blurring dimmed={this.state.loading}>
          <Dimmer active={this.state.loading} onClickOutside={this.handleHide} />
            <div className="container-drag">
              <Sidebar.Pushable as={Segment} inverted>
                <Sidebar
                  as={Menu}
                  animation={this.state.animation2}
                  direction={this.state.direction2}
                  icon='labeled'
                  target={this.segmentRef}
                  onHide={this.props.handleTopSidebarHide}
                  visible={this.props.topSidebarVisible}
                  width='very wide'
                  style={{}}
                  >


                    <Segment inverted style={{width:"100%"}}>
                      <Button.Group >
                        <Button secondary name="Stage" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Stage') ? true : false } ><FormattedMessage id="app.story.board.stage" defaultMessage={`Stage`}/></Button>
                        <Button secondary name="Geo" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Geo') ? true : false }>Geo</Button>
                        <Button secondary name="Images" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Images') ? true : false }><FormattedMessage id="app.story.board.images" defaultMessage={`Images`}/></Button>
                      </Button.Group>
                      {(this.props.stageStep === 'Stage') ? this.props.editStage() : ''}
                      {(this.props.stageStep === 'Images') ? (
                        <Segment stacked inverted>
                          <Segment  style={{width:"100%", padding:0}}
                            className="images"
                            onDragOver={(e)=>this.props.onDragOver(e)}
                            onDrop={(e)=>{this.props.onDrop(e, "images")}}>
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
                            height="70vh"
                            sid={this.props.state.sid}
                            setStageLocation={this.props.setStageLocation}
                            stageLocation={this.props.stage.stageLocation}
                            style={{width:"100%", padding:0}}
                            />
                        ) : ''}
                      </Segment>

                  </Sidebar>
                  <Sidebar inverted
                    as={Menu}
                    animation={this.state.animation}
                    direction={this.state.direction}
                    vertical
                    style={{padding: 0, maxHeight: '50vh'}}
                    dimmed={this.state.dimmed}
                    onHide={this.props.handleSidebarHide}
                    target={this.segmentRef}
                    width='very wide'
                    visible={this.props.sidebarVisible}
                    >
                    <Segment.Group horizontal  >
                        <Segment inverted fluid style={{maxWidth: '20vh'}}>
                            <Button.Group  vertical>
                              <Button secondary name="Pictures" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Pictures') ? true : false }><FormattedMessage id="app.story.board.pictures" defaultMessage={`Pictures`}/></Button>
                              <Button secondary name="Videos" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Videos') ? true : false }>Videos</Button>
                              <Button secondary name="Audios" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Audios') ? true : false }>Audios</Button>
                            </Button.Group>
                        </Segment>
                        <Segment inverted  style={{minWidth: '82vh', padding:0}}>
                          {(this.props.stageStep === 'Pictures') ? (

                           <Segment.Group inverted horizontal
                              className="pictures"
                              onDragOver={(e)=>this.props.onDragOver(e)}
                              onDrop={(e)=>{this.props.onDrop(e, "pictures")}}>

                              <Segment className='files' style={picturesContainer}>
                                {tasks.pictures}
                              </Segment>

                              <Segment>
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

                        </Segment.Group>
                      ) : ''}
                      {(this.props.stageStep === 'Videos') ? (
                        <Segment.Group inverted horizontal
                          className="videos"
                          onDragOver={(e)=>this.props.onDragOver(e)}
                          onDrop={(e)=>{this.props.onDrop(e, "videos")}}>
                        <Segment className='files' style={{ minWidth: '55vw'}}>
                          {tasks.videos}
                          </Segment>
                          <Segment>
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
                      </Segment.Group>
                      ) : ''}
                      {(this.props.stageStep === 'Audios') ? (
                        <Segment.Group inverted horizontal
                          className="audios"
                          onDragOver={(e)=>this.props.onDragOver(e)}
                          onDrop={(e)=>{this.props.onDrop(e, "audios")}}>
                        <Segment className='files' style={{ minWidth: '55vw'}}>
                          {tasks.audios}
                        </Segment>
                        <Segment>
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
                      </Segment.Group>
                      ) : ''}
                    </Segment>
                    </Segment.Group>
                  </Sidebar>

                  <Sidebar.Pusher>

                        <Segment className="main-board">
                            <Segment className='stageProfile' inverted style={{minHeight: '18vh'}}>
                              <Grid columns={4}>
                                <Grid.Column mobile={16} tablet={2} computer={2} className='stagePhoto'>
                                    <Segment style={{padding:'0', background: 'transparent'}} onDragOver={(e)=>this.props.onDragOver(e)}
                                    onDrop={(e)=>this.props.onDrop(e, "photo")}>
                                    {(tasks.photo.length > 0) ? tasks.photo : <Image src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped  /> }
                                    </Segment>
                                </Grid.Column>
                                <Grid.Column mobile={16} tablet={4} computer={3}>
                                    <Header inverted as='h4'>{this.props.stage.name}</Header>
                                    {this.props.setStageDescription()}
                                    <Icon className="button left floated" floated="left" name="edit outline"  onClick={this.props.toggleLock}  />
                                </Grid.Column>
                                <Grid.Column  mobile={16} tablet={4} computer={4}>
                                  {this.props.setStagePictures()}
                                  <Icon className="button left floated" floated="left" name="edit outline"  onClick={this.props.togglePictureLock}  />
                                </Grid.Column>
                                <Grid.Column textAlign='right' mobile={16} tablet={8} computer={6}>
                                    {(this.props.stages) ? this.StagesNav(this.props.stages, this.props.stage) : null}
                                </Grid.Column>
                            </Grid>
                           </Segment>

                        <Ref innerRef={this.segmentRef}>
                        <Segment inverted className="board" style={{minHeight: '65.2vh'}} fluid="true">
                          <Resizable
                            style={resizeStyle}
                            defaultSize={this.state.col2DefaultSize}
                            >
                            <Segment inverted className="stageCol">
                                <Button size='small' primary onClick={(e) => this.props.toggleSideBar(e, 'Audios', 'right')} className="task-header"><FormattedMessage id="app.story.board.onzoneenter" defaultMessage={`On Zone Enter`}/></Button>
                              <div className="droppable"
                                onDragOver={(e)=>this.props.onDragOver(e)}
                                onDrop={(e)=>this.props.onDrop(e, "onZoneEnter")}>
                                {tasks.onZoneEnter}
                              </div>
                            </Segment>
                          </Resizable>
                          <Resizable
                            style={resizeStyle}
                            defaultSize={this.state.col3DefaultSize}
                            >
                            <Segment inverted className="stageCol">
                                <Button size='small' primary onClick={(e) => this.props.toggleSideBar(e, 'Videos', 'right')} className="task-header"><FormattedMessage id="app.story.board.onpicturematch" defaultMessage={`On Picture Match`}/></Button>
                              <div className="droppable"
                                onDragOver={(e)=>this.props.onDragOver(e)}
                                onDrop={(e)=>this.props.onDrop(e, "onPictureMatch")}>
                                {tasks.onPictureMatch}
                              </div>
                            </Segment>
                          </Resizable>
                          <Resizable
                            style={resizeStyle}
                            defaultSize={this.state.col4DefaultSize}
                            >
                            <Segment inverted className="stageCol">
                                <Button size='small' primary onClick={(e) => this.props.toggleSideBar(e, 'Audios', 'right')} className="task-header"><FormattedMessage id="app.story.board.onzoneleave" defaultMessage={`On Zone Leave`}/>
                                </Button>                              <div className="droppable"
                                onDragOver={(e)=>this.props.onDragOver(e)}
                                onDrop={(e)=>this.props.onDrop(e, "onZoneLeave")}>
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
