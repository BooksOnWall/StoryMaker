import React, { Component } from 'react';
import Auth from '../../module/Auth';
import AvatarEditor from 'react-avatar-editor';
import { Slider } from "react-semantic-ui-range";

import {
  Form,
  Button,
  Checkbox,
  Progress,
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
      image: src,
      allowZoomOut: true,
      position: { x: 0.2, y: 0.2 },
      scale: 1,
      rotate: 0,
      borderRadius: 50,
      preview: null,
      width: 180,
      height: 180,
      file: null,
      fileName: '',
      isUploading: false,
      statusCode: ''
    };

    this.handleScale = this.handleScale.bind(this);
    this.handlePositionChange = this.handlePositionChange.bind(this);
    this.toggleAuthenticateStatus = this.toggleAuthenticateStatus.bind(this);
  }
  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  handleScale = scale => {
    try {
      this.setState({ scale : parseFloat(scale) });
    } catch(e) {
      console.log(e.message);
    }
  }
  handleBorderRadius = borderRadius => {
    try {
      this.setState({ borderRadius : parseFloat(borderRadius) });
    } catch(e) {
      console.log(e.message);
    }
  }
  toggleZoomOut = zoomout => {
    this.setState({ allowZoomOut: zoomout })
  }
  handlePositionChange = position => {
      this.setState({position: position });
  }
  onClickSave = () => {
    if (this.editor) {
      // This returns a HTMLCanvasElement, it can be made into a data URL or a blob,
      // drawn on another canvas, or added to the DOM.
      const canvas = this.editor.getImage()

      // If you want the image resized to the canvas size (also a HTMLCanvasElement)
      const canvasScaled = this.editor.getImageScaledToCanvas()
    }
  }
  fileInputRef = React.createRef();

  onFormSubmit = e => {
    e.preventDefault(); // Stop form submit
    //this.fileUpload(this.state.file).then(response => {
      //console.log(response.data);
    //});
  };

  fileChange = e => {
    this.setState(
      { image: e.target.files[0], file: e.target.files[0], fileName: e.target.files[0].name },
      () => {
        console.log(
          "File chosen --->",
          this.state.file,
          console.log("File name  --->", this.state.fileName)
        );
      }
    );
  };

  fileUpload = async file => {
      const formData = new FormData();
      formData.append("file", file);
      try {
        fetch.post("/file/upload/enpoint").then(response => {
          console.log(response);
          console.log(response.status);
          this.setState({ statusCode: response.status }, () => {
            console.log(
              "This is the response status code --->",
              this.state.statusCode
            );
          });
        });
      } catch (error) {
        console.error(Error(`Error uploading file ${error.message}`));
      }

      const data = JSON.stringify({
        uploadData: file
      });
      console.log(data);
    };

  // Export Schedules Tab 2
  fileExport = file => {
    // handle save for export button function
  };
  setEditorRef = (editor) => this.editor = editor;
  render() {
    const { statusCode } = this.state;
    return (
      <div>
        <div>
          <AvatarEditor
            ref={this.setEditorRef}
            scale={parseFloat(this.state.scale)}
            width={this.state.width}
            height={this.state.height}
            position={this.state.position}
            onPositionChange={this.handlePositionChange}
            rotate={parseFloat(this.state.rotate)}
            borderRadius={this.state.width / (100 / this.state.borderRadius)}
            image={this.state.image}
            className="editor-canvas"
            />
        </div>
      <br />
        <Form onSubmit={this.onClickSave}>
                <Form.Field>
                  <Button
                    content="Choose Avatar"
                    labelPosition="left"
                    icon="file"
                    onClick={() => this.fileInputRef.current.click()}
                  />
                <input
                    ref={this.fileInputRef}
                    type="file"
                    hidden
                    onChange={this.fileChange}
                  />
                </Form.Field>
                <Button  type="submit">Upload</Button>
                  {statusCode && statusCode === "200" ? (
                    <Progress
                      style={{ marginTop: "20px" }}
                      percent={100}
                      success
                      active
                      progress
                    />
                  ) : statusCode && statusCode === "500" ? (
                    <Progress
                      style={{ marginTop: "20px" }}
                      percent={100}
                      error
                      active
                      progress
                    />
                  ) : null}
          </Form>
      <br />
      Zoom:
      <Slider color="red"
        settings={{
          name: 'scale',
          type: 'range',
          onChange: this.handleScale,
          min: this.state.allowZoomOut ? parseFloat(1) : parseFloat(2) ,
          max: 10,
          step: 1,
          defaultValue: this.state.scale,
      }} />
      <br />
      <Checkbox
        placeholder='Allow Scale < 1'
        ref = "allowZoomOut"
        label = "Allow Scale < 1"
        name="allowZoomOut"
        defaultChecked = {true}
        onChange= {this.toggleZoomOut}
        toggle
      />
      <br />
      Corner radius:
      <Slider color="red"
        settings={{
          name: 'borderRadius',
          type: 'range',
          onChange: this.handleBorderRadius,
          min: 0,
          max: 50,
          step: parseFloat(1),
          defaultValue: this.state.borderRadius,
      }} />
      <br />
      </div>
    );
  }
}

export default userAvatar;
