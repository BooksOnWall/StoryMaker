import React, { Component } from 'react';
import {
  Segment,

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
        files: [
            {name:"Learn Angular",category:"wip", bgcolor: "yellow"},
            {name:"React", category:"wip", bgcolor:"pink"},
            {name:"Vue", category:"wip", bgcolor:"skyblue"}
          ]
    }
    async componentDidMount() {
      await this.buildFiles();
    }
    buildFiles =  () => {
      var files = this.state.build;
      this.state.files.forEach ((t) => {
          files[t.category].push(
              <div key={t.name}
                  onDragStart = {(e) => this.onDragStart(e, t.name)}
                  draggable
                  className="draggable"
                  style = {{backgroundColor: t.bgcolor}}
              >
                  {t.name}
              </div>
          );
      });
      this.setState({build: files});

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

       let files = this.state.files.filter((task) => {
           task.category = (task.name === id) ? cat : null;
           return task;
       });

       this.setState({
           ...this.state,
           files
       });
    }

    render() {

        console.log(this.state.build);
        return (

            <div className="container-drag">
              <div className="wip"
                  onDragOver={(e)=>this.onDragOver(e)}
                  onDrop={(e)=>{this.onDrop(e, "wip")}}>
                  <span className="task-header">WIP</span>
                  {this.state.build.wip}
              </div>
              <Segment.Group horizontal >
                <Segment>
                    <div className="droppable"
                        onDragOver={(e)=>this.onDragOver(e)}
                        onDrop={(e)=>this.onDrop(e, "editStage")}>
                         <span className="task-header">Edit Stage</span>
                         {this.state.build.editStage}
                    </div>
                </Segment>
                <Segment>
                    <div className="droppable"
                        onDragOver={(e)=>this.onDragOver(e)}
                        onDrop={(e)=>this.onDrop(e, "onZoneEnter")}>
                         <span className="task-header">On Zone Enter</span>
                         {this.state.build.onZoneEnter}
                    </div>
                </Segment>
                <Segment>
                    <div className="droppable"
                        onDragOver={(e)=>this.onDragOver(e)}
                        onDrop={(e)=>this.onDrop(e, "onPictureMatch")}>
                         <span className="task-header">On Picture Match</span>
                         {this.state.build.onPictureMatch}
                    </div>
                </Segment>
                <Segment>
                    <div className="droppable"
                        onDragOver={(e)=>this.onDragOver(e)}
                        onDrop={(e)=>this.onDrop(e, "onZoneLeave")}>
                         <span className="task-header">On Zone Leave</span>
                         {this.state.build.onZoneLeave}
                    </div>
                </Segment>
              </Segment.Group>




            </div>
        );
    }
}
export default DragDrop;
