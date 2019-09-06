import React, { Component,  createRef, useState } from 'react';
import {
  Segment,
  Image,
  Sidebar,
  Menu,
  Ref,
  Icon,
  Label,
  Card,
  Button,
} from 'semantic-ui-react';
import '../../../../node_modules/video-react/dist/video-react.css';

import StageMap from '../map/stageMap';
import StagePictures from './stagePictures';
import StageVideos from './stageVideos';
import StageAudios from './stageAudios';
import StageImages from './stageImages';
import HtmlParser from 'react-html-parser';
import { Resizable } from "re-resizable";
import { Player } from 'video-react';

const resizeStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  float: "left",
  border: "solid 1px #ddd",
  background: "#f0f0f0"
};
const ImagesPreview = (props) => {

if(props && props.images) {
  let images = props.images;
  const items = images.map(function(e,index){
      return <Image
        name={e.name}
        wrapped
        style={{margin: '1em'}}
        size="small"
        id={"images_"+ index}
        key={"img_"+ index}
        src={e.preview}/>
  });
  items.push(<Button
    primary
    loading={props.imagesLoading}
    onClick={props.uploadImages}
  >Upload</Button>);

    return items
}

return null
};
const PicturesPreview = (props) => {

if(props && props.pictures) {
  let images = props.pictures;

  if(images && images.length > 0) {
    const items = images.map(function(e,index){
        return <Image
          name={e.name}
          wrapped
          style={{margin: '1em'}}
          size="small"
          id={"picture_"+ index }
          key={"pic_"+ index }
          src={e.preview}/>
    });

    items.push(<Button
      primary
      loading={props.picturesLoading}
      onClick={props.uploadPictures}
    >Upload</Button>);
    return items;
  }
}

return null
};
const VideosPreview = (props) => {

if(props && props.videos) {
  let videos = props.videos;

  if(videos && videos.length > 0) {
    const items = videos.map(function(e,index){
        console.log(e);
        return   <Player
            fluid
            preload="auto"
            playsInline
            name={e.name}
            id={"video_"+ index }
            key={"vid_"+ index }
            poster="/assets/poster.png"
            >
            <source src={e.src} />
          </Player>
    });

    items.push(<Button
      primary
      loading={props.videosLoading}
      onClick={props.uploadVideos}
    >Upload</Button>);
    return items;
  }
}
return null
};
class DragDrop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animation: 'overlay',
      direction: 'right',
      animation2: 'push',
      direction2: 'top',
      col1DefaultSize: { width: '25%', height: '100%'},
      col2DefaultSize: { width: '25%', height: '100%'},
      col3DefaultSize: { width: '25%', height: '100%'},
      col4DefaultSize: { width: '25%', height: '100%'},
      dimmed: null
    };

  }

  segmentRef = createRef()

  render() {
    var tasks = this.props.renderTasks();
    return (

      <div className="container-drag">

        <Button.Group fluid>
          <Button animated primary floated="left">
            <Button.Content visible={this.props.sidebarVisible}>Prev</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow left' />
            </Button.Content>
          </Button>
          <Button disabled={this.props.topSidebarVisible} onClick={this.props.handleTopShowClick}>
            Show top bar
          </Button>
          <Button disabled={!this.props.topSidebarVisible} onClick={this.props.handleTopHideClick}>
            Hide Top bar
          </Button>
          <Button disabled={this.props.sidebarVisible} onClick={this.props.handleShowClick}>
            Show sidebar
          </Button>
          <Button disabled={!this.props.sidebarVisible} onClick={this.props.handleHideClick}>
            Hide sidebar
          </Button>

          <Button animated primary floated="right">
            <Button.Content visible={this.props.sidebarVisible}>Next</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow right' />
            </Button.Content>
          </Button>
      </Button.Group>
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
          >
          <Segment.Group style={{width: 'inherit'}}>
            <Segment >
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
                <Segment>
                  <Segment
                    className="images"
                    onDragOver={(e)=>this.props.onDragOver(e)}
                    onDrop={(e)=>{this.props.onDrop(e, "images")}}>
                    <span className="task-header">Images</span>
                    {tasks.images}
                  </Segment>
                  <ImagesPreview imagesLoading={this.props.imagesLoading} uploadImages={this.props.uploadImages} name="stageImages" images={this.props.stageImages} />
                  <StageImages setStageImages={this.props.setStageImages} onChangeImagesHandler={this.props.onChangeImagesHandler} stageImages={this.props.stageImages}/>
                </Segment> ) : ''}
              {(this.props.stageStep === 'Geo') ? <StageMap setStageLocation={this.props.setStageLocation} stageLocation={this.props.stage.stageLocation}/> : ''}
            </Segment>
          </Segment.Group>


          </Sidebar>
          <Sidebar
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

          <Segment >
              {(this.props.stageStep === 'Pictures') ? (
                <Segment
                  className="pictures"
                  onDragOver={(e)=>this.props.onDragOver(e)}
                  onDrop={(e)=>{this.props.onDrop(e, "pictures")}}>
                  <Label inverted color="violet" className="task-header">Pictures</Label>
                  {tasks.pictures}

                <PicturesPreview
                  picturesLoading={this.props.picturesLoading}
                  uploadPictures={this.props.uploadPictures}
                  name="stagePictures"
                  pictures={this.props.stagePictures} />
                  <StagePictures
                    className="pictures"
                    onDragOver={(e)=>this.props.onDragOver(e)}
                    onDrop={(e)=>{this.props.onDrop(e, "pictures")}}
                    tasks={this.props.tasks}
                    onPictureDrop={this.props.onDrop}
                    onDragStart={this.props.onDragStart}
                    onPictureDragOver={this.props.onDragOver}
                    onChangePicturesHandler={this.props.onChangePicturesHandler}
                    setStagePictures={this.props.setStagePictures}/>
              </Segment>
              ) : ''}
              {(this.props.stageStep === 'Videos') ? (
                <Segment
                  className="videos"
                  onDragOver={(e)=>this.props.onDragOver(e)}
                  onDrop={(e)=>{this.props.onDrop(e, "videos")}}>
                  <Label inverted="true" color="violet" className="task-header">Videos</Label>
                  {tasks.videos}

                <VideosPreview
                  videosLoading={this.props.videosLoading}
                  uploadVideos={this.props.uploadVideos}
                  name="stageVideos"
                  videos={this.props.stageVideos} />
                <StageVideos
                    className="videos"
                    onDragOver={(e)=>this.props.onDragOver(e)}
                    onDrop={(e)=>{this.props.onDrop(e, "videos")}}
                    tasks={this.props.tasks}
                    onVideosDrop={this.props.onDrop}
                    onDragStart={this.props.onDragStart}
                    onVideosDragOver={this.props.onDragOver}
                    onChangeVideosHandler={this.props.onChangeVideosHandler}
                    setStageVideos={this.props.setStageVideos}/>
              </Segment>
              ) : ''}
              {(this.props.stageStep === 'Audio') ? 'stage audio' : ''}
          </Segment>

          </Sidebar>

          <Sidebar.Pusher>
            <Segment >
              <Ref innerRef={this.segmentRef}>
                <Segment className='slide-out' fluid="true">
                  <header as='h1'>{this.props.stage.name}</header>
                  <Resizable
                    style={resizeStyle}
                    defaultSize={this.state.col1DefaultSize}
                    >
                    <Segment className="stageCol">
                      <Label inverted="true" color="violet" className="task-header">Edit Stage</Label>
                      <Card.Group >
                        <Card>
                          <Card.Content
                            className="droppable single image"
                            onDragOver={(e)=>this.props.onDragOver(e)}
                            onDrop={(e)=>this.props.onDrop(e, "photo")}
                            >
                            <Label inverted="true" color="violet" className="task-header">Photo</Label>
                            {(tasks.photo.length > 0) ? tasks.photo : <Image  src='https://react.semantic-ui.com/images/avatar/large/matthew.png' wrapped  /> }
                            <Card.Header>{this.props.stage.name}</Card.Header>
                            <Card.Meta>Drag your image here </Card.Meta>
                          </Card.Content>
                        </Card>
                        <Card >
                          <Card.Content>
                            <Card.Description className="single">
                              <Label inverted="true" color="violet" className="task-header">Description</Label>
                              {HtmlParser(this.props.stage.description)}
                            </Card.Description>
                          </Card.Content>
                        </Card>
                        <Card >
                          <Card.Content className="single"
                            onDragOver={(e)=>this.props.onDragOver(e)}
                            onDrop={(e)=>this.props.onDrop(e, "location")}
                            >
                            <Label inverted="true" color="violet" className="task-header">Location</Label>
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
                    <Segment className="stageCol">
                      <div className="droppable"
                        onDragOver={(e)=>this.props.onDragOver(e)}
                        onDrop={(e)=>this.props.onDrop(e, "onZoneEnter")}>
                        <Label inverted="true" color="violet" className="task-header">On Zone Enter</Label>
                        {tasks.onZoneEnter}
                      </div>
                    </Segment>
                  </Resizable>
                  <Resizable
                    style={resizeStyle}
                    defaultSize={this.state.col3DefaultSize}
                    >
                    <Segment className="stageCol">
                      <div className="droppable"
                        onDragOver={(e)=>this.props.onDragOver(e)}
                        onDrop={(e)=>this.props.onDrop(e, "onPictureMatch")}>
                        <Label inverted="true" color="violet" className="task-header">On Picture Match</Label>
                        {tasks.onPictureMatch}
                      </div>
                    </Segment>
                  </Resizable>
                  <Resizable
                    style={resizeStyle}
                    defaultSize={this.state.col4DefaultSize}
                    >
                    <Segment className="stageCol">
                      <div className="droppable"
                        onDragOver={(e)=>this.props.onDragOver(e)}
                        onDrop={(e)=>this.props.onDrop(e, "onZoneLeave")}>
                        <Label inverted="true" color="violet" className="task-header">On Zone Leave</Label>
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
    );
  };
}
export default DragDrop;
