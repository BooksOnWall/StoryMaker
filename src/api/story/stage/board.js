import React, { Component } from 'react';
import {
  Segment,
  Image

} from 'semantic-ui-react';


class DragDrop extends Component {
    state = {
        build: {
          wip: [],
          editStage: [],
          onZoneEnter: [],
          onPictureMatch: [],
          onZoneLeave: []
        },
        tasks: [
            {name:"Text",type: 'text',category:"wip", bgcolor: "yellow"},
            {name:"Image", type: 'image' , src: 'http://myimage.jpg', category:"wip", bgcolor:"pink"},
            {name:"Audio", type: 'audio' , src: 'http://myaudio.mp3', category:"wip", bgcolor:"skyblue"},
            {name:"Video", type: 'video' , src: 'http://myvideo.mp4', category:"wip", bgcolor:"skyblue"},
            {name:"Text 2", type: 'text' , category:"wip", bgcolor:"skyblue"}
          ]
    }

    onDragStart = (ev, id) => {
        console.log('dragstart:',id);
        ev.dataTransfer.setData("id", id);
    }

    onDragOver = (ev) => {
        ev.preventDefault();
    }

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

    render() {
        const { build} = this.state;
        var tasks = {
          wip: [],
          editStage: [],
          onZoneEnter: [],
          onPictureMatch: [],
          onZoneLeave: []
        };

          this.state.tasks.forEach ((t) => {


              switch(t.type) {

                case 'text':
                  tasks[t.category].push(
                    <div key={t.name}
                    onDragStart = {(e) => this.onDragStart(e, t.name)}
                    draggable
                    className="draggable"
                    style = {{backgroundColor: t.bgcolor}}
                    >
                    {t.name}
                    </div>
                  );
                  break;
                case 'image':
                    tasks[t.category].push(
                      <Image key={t.name}
                      onDragStart = {(e) => this.onDragStart(e, t.name)}
                      draggable
                      className="draggable"
                      src={t.src}
                      style = {{backgroundColor: t.bgcolor}}
                      />
                    );
                  break;
                case 'video':
                  tasks[t.category].push(
                    <div key={t.name}
                    onDragStart = {(e) => this.onDragStart(e, t.name)}
                    draggable
                    className="draggable"
                    style = {{backgroundColor: t.bgcolor}}
                    >
                    {t.name}
                    </div>
                  );
                break;
                default:
                break;
              }
          });


        return (

            <div className="container-drag">
              <div className="wip"
                  onDragOver={(e)=>this.onDragOver(e)}
                  onDrop={(e)=>{this.onDrop(e, "wip")}}>
                  <span className="task-header">WIP</span>
                  {tasks.wip}

              </div>
              <Segment.Group horizontal >
                <Segment>
                    <div className="droppable"
                        onDragOver={(e)=>this.onDragOver(e)}
                        onDrop={(e)=>this.onDrop(e, "editStage")}>
                         <span className="task-header">Edit Stage</span>
                         {tasks.editStage}
                    </div>
                </Segment>
                <Segment>
                    <div className="droppable"
                        onDragOver={(e)=>this.onDragOver(e)}
                        onDrop={(e)=>this.onDrop(e, "onZoneEnter")}>
                         <span className="task-header">On Zone Enter</span>
                         {tasks.onZoneEnter}
                    </div>
                </Segment>
                <Segment>
                    <div className="droppable"
                        onDragOver={(e)=>this.onDragOver(e)}
                        onDrop={(e)=>this.onDrop(e, "onPictureMatch")}>
                         <span className="task-header">On Picture Match</span>
                         {tasks.onPictureMatch}
                    </div>
                </Segment>
                <Segment>
                    <div className="droppable"
                        onDragOver={(e)=>this.onDragOver(e)}
                        onDrop={(e)=>this.onDrop(e, "onZoneLeave")}>
                         <span className="task-header">On Zone Leave</span>
                         {tasks.onZoneLeave}
                    </div>
                </Segment>
              </Segment.Group>




            </div>
        );
    }
}
export default DragDrop;
