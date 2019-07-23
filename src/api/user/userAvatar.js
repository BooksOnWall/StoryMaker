import React, { Component } from 'react';
import Auth from '../../module/Auth';
import AvatarEditor from 'react-avatar-editor';
import { Slider } from "react-semantic-ui-range";

import {
  Input,
} from 'semantic-ui-react';

import src from '../../assets/images/patrick.png';

class userAvatar extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      server: server,
      users: server + 'users',
      user: server + 'users/',
      data: null,
      authenticated: this.toggleAuthenticateStatus,
      avatar: {
        image: 'avatar.jpg',
        allowZoomOut: true,
        position: { x: 0.5, y: 0.5 },
        scale: 1,
        rotate: 0,
        borderRadius: 0,
        preview: null,
        width: 180,
        height: 180,
      }
    };
    this.handleNewImage = this.handleNewImage.bind(this);
    this.handleScale = this.handleScale.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
    this.toggleAuthenticateStatus = this.toggleAuthenticateStatus.bind(this);
  }
  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  handleNewImage = e => {
      this.setState({...this.state.avatar, image: e.target.files[0] })
  }

  handleScale = e => {
    console.log(e.target.value);
      const scale = parseFloat(e.target.value);
      this.setState({...this.state.avatar, scale : scale });
  }
  toggleZoomOut = e => {
    this.setState({...this.state.avatar, allowZoomOut: true })
  }
  handlePositionChange = position => {
      this.setState({...this.state.avatar,position: position });
  }
  onClickSave = () => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage()

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      //const canvasScaled = this.editor.getImageScaledToCanvas()
    }
  }
  setEditorRef = (editor) => this.editor = editor;
  render() {
    return (
      <div>
        <div>
          <AvatarEditor
            ref={this.setEditorRef}
            scale={parseFloat(this.state.avatar.scale)}
            width={this.state.avatar.width}
            height={this.state.avatar.height}
            position={this.state.avatar.position}
            onPositionChange={this.handlePositionChange}
            rotate={parseFloat(this.state.avatar.rotate)}
            borderRadius={this.state.avatar.width / (100 / this.state.avatar.borderRadius)}
            image={src}
            className="editor-canvas"
            />
        </div>
      <br />
      New File:
      <input name="newImage" type="file" onChange={this.handleNewImage} />
      <br />
      Zoom:
      <Slider color="red"
        settings={{
          name: 'scale',
          type: 'range',
          onChange: value => this.handleScale,
          min: this.state.avatar.allowZoomOut ? parseFloat(0.1) : parseFloat(1) ,
          max: parseFloat(20),
          step: parseFloat(1),
          defaultValue: this.state.avatar.scale,
      }} />
      <br />
      Allow Scale &lt; 1
      <Input
        type="checkbox"
        name="allowZoomOut"
        onChange= {this.toggleZoomOut}
        defaultValue="on"
      />
      <br />
      Border radius:
      <Slider color="red"
        settings={{
          name: 'borderRadius',
          type: 'range',
          onChange: value => this.handleBorderRadius,
          min: 0,
          step: parseFloat(1),
          defaultValue: this.state.avatar.borderRadius,
      }} />

      <br />
      </div>
    );
  }
}

export default userAvatar;
