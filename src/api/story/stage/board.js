import React, { Component,  createRef } from 'react';
import {
  Segment,
  Image,
  Sidebar,
  Menu,
  Ref,
  Icon,
  Placeholder,
  Button,
} from 'semantic-ui-react';
import '../../../../node_modules/video-react/dist/video-react.css';
import { Player } from 'video-react';
import ReactAudioPlayer from 'react-audio-player';
import StageMap from '../map/stageMap';
import StagePictures from './stagePictures';

class DragDrop extends Component {
  constructor(props) {
    super(props);

    this.state = {
      animation: 'overlay',
      direction: 'right',
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

  render() {
    const segmentRef = createRef();
    var tasks = {
      wip: [],
      editStage: [],
      onZoneEnter: [],
      onPictureMatch: [],
      onZoneLeave: []
    };
    if (this.props.tasks) {
      this.props.tasks.forEach ((t) => {
        switch(t.type) {
          case 'text':
          tasks[t.category].push(
            <Segment
              inverted
              color="orange"
              key={t.name}
              onDragStart = {(e) => this.props.onDragStart(e, t.name)}
              draggable
              className="draggable"
              style = {{backgroundColor: t.bgcolor}}
              >
              {t.name}
            </Segment>
          );
          break;
          case 'Placeholder':
          tasks[t.category].push(
            <Placeholder
              name="Photo"
              className="droppable"
              onDragOver={(e)=>this.props.onDragOver(e)}
              onDrop={(e)=>this.props.onDrop(e, "editStage")}
              fluid
              >
              <div >
                <span className="task-header">Edit Stage</span>
                {tasks.editStage}
              </div>
              <Placeholder.Image />
            </Placeholder>
          );
          break;
          case 'image':
          tasks[t.category].push(
            <Image
              key={t.name}
              size='medium'
              onDragStart = {(e) => this.props.onDragStart(e, t.name)}
              draggable
              className="draggable"
              src={t.src}
              style = {{backgroundColor: t.bgcolor}}
              />
          );
          break;
          case 'video':
          tasks[t.category].push(
            <Segment
              inverted
              color="violet"
              key={t.name}
              onDragStart = {(e) => this.props.onDragStart(e, t.name)}
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
    return (

      <div className="container-drag">
        <Button.Group fluid>
          <Button animated primary floated="left">
            <Button.Content visible={this.props.sidebarVisible}>Prev</Button.Content>
            <Button.Content hidden>
              <Icon name='arrow left' />
            </Button.Content>
          </Button>
          <Button disabled={this.props.sidebarVisible} onClick={this.props.handleShowClick}>
            Show sidebar
          </Button>
          <Button disabled={!this.props.sidebarVisible} onClick={this.props.handleHideClick}>
            Hide sidebar
          </Button>
          <Button disabled={this.props.sidebarVisible} onClick={this.props.handleBotShowClick}>
            Show bottom bar
          </Button>
          <Button disabled={!this.props.sidebarVisible} onClick={this.props.handleBotHideClick}>
            Hide bottom bar
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
            animation='push'
            direction='bottom'
            icon='labeled'
            target={this.segmentRef}
            onHide={this.props.handleBotSidebarHide}
            visible={this.props.botSidebarVisible}
            width='very wide'
          >
          <Segment.Group>
            <Segment >
              <Button.Group >
                <Button name="Stage" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Stage') ? true : false } >Stage</Button>
                  <Button.Or text='or' />
                  <Button name="Geo" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Geo') ? true : false }>Geo</Button>
                  <Button.Or text='or' />
                  <Button name="Images" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Images') ? true : false }>Images</Button>
              </Button.Group>
            </Segment>
            <Segment>
              {(this.props.stageStep === 'Stage') ? (
                <span>stage</span>
            //    this.editStage(),
            //    this.stageDescription()
              ) : ''}
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
          left
          {(this.props.stageStep === 'Pictures') ?
          <span>dd</span>
          : ''}

          <Button.Group>
            <Button name="Pictures" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Pictures') ? true : false }>Pictures</Button>
            <Button.Or text='or' />
            <Button name="Video" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Video') ? true : false }>Video</Button>
              <Button.Or text='or' />
              <Button name="Audio" onClick={this.props.handleStageStep} positive={(this.props.stageStep === 'Audio') ? true : false }>Audio</Button>
          </Button.Group>

          <Segment >
              {(this.props.stageStep === 'Pictures') ? <StagePictures tasks={this.props.tasks} onDrop={this.props.onDrop} onDragStart={this.props.onDragStart} onDragOver={this.props.onDragOver} onChangeHandler={this.props.onChangeHandler} setPictures={this.props.setPictures}/> : ''}
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
            <Segment basic>
              <Ref innerRef={this.segmentRef}>
                <Segment className='slide-out'>
                  <header as='h1'>{this.props.stage.name}</header>
                    <Segment.Group horizontal >
                      <Segment>
                        <div className="droppable"
                          onDragOver={(e)=>this.props.onDragOver(e)}
                          onDrop={(e)=>this.props.onDrop(e, "editStage")}>
                          <span className="task-header">Edit Stage</span>
                          {tasks.editStage}
                        </div>
                      </Segment>
                      <Segment>
                        <div className="droppable"
                          onDragOver={(e)=>this.props.onDragOver(e)}
                          onDrop={(e)=>this.props.onDrop(e, "onZoneEnter")}>
                          <span className="task-header">On Zone Enter</span>
                          {tasks.onZoneEnter}
                        </div>
                      </Segment>
                      <Segment>
                        <div className="droppable"
                          onDragOver={(e)=>this.props.onDragOver(e)}
                          onDrop={(e)=>this.props.onDrop(e, "onPictureMatch")}>
                          <span className="task-header">On Picture Match</span>
                          {tasks.onPictureMatch}
                        </div>
                      </Segment>
                      <Segment>
                        <div className="droppable"
                          onDragOver={(e)=>this.props.onDragOver(e)}
                          onDrop={(e)=>this.props.onDrop(e, "onZoneLeave")}>
                          <span className="task-header">On Zone Leave</span>
                          {tasks.onZoneLeave}
                        </div>
                      </Segment>
                    </Segment.Group>
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
