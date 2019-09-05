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
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import StageMap from '../map/stageMap';
import StagePictures from './stagePictures';
import StageImages from './stageImages';
import HtmlParser from 'react-html-parser';
import { Resizable } from "re-resizable";

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
      dimmed: null,
        build: {
          wip: [],
          editStage: [],
          onZoneEnter: [],
          onPictureMatch: [],
          onZoneLeave: []
        }
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
            <Button name="Video" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Video') ? true : false }>Video</Button>
              <Button.Or text='or' />
              <Button name="Audio" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Audio') ? true : false }>Audio</Button>
          </Button.Group>

          <Segment >
              {(this.props.stageStep === 'Pictures') ? <StagePictures
                className="pictures"
                onDragOver={(e)=>this.props.onDragOver(e)}
                onDrop={(e)=>{this.props.onDrop(e, "pictures")}}
                tasks={this.props.tasks}
                onPictureDrop={this.props.onDrop}
                onDragStart={this.props.onDragStart}
                onPictureDragOver={this.props.onDragOver}
                onChangePicturesHandler={this.props.onChangePicturesHandler}
                setStagePictures={this.props.setStagePictures}/> : ''}
              {(this.props.stageStep === 'Video') ? 'stage video' : ''}
              {(this.props.stageStep === 'Audio') ? 'stage audio' : ''}
          </Segment>
          <Segment
            className="wip"
            onDragOver={(e)=>this.props.onDragOver(e)}
            onDrop={(e)=>{this.props.onDrop(e, "wip")}}>
            <span className="task-header">WIP</span>
            {tasks.wip}
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
