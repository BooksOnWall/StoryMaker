import React, { Component, useRef } from 'react';
import Auth from '../../module/Auth';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import Preview from './avatarPreview.js';
import { Slider } from "react-semantic-ui-range";
import { Formik } from 'formik';
import { injectIntl, FormattedMessage } from 'react-intl';
import {
  Form,
  Button,
  Input,
  Checkbox,
  Divider,
  Tab,
  Icon,
  Modal,
  Image,
  Header,
  Container,
  Placeholder,
  Segment,
  Progress,
} from 'semantic-ui-react';

import src from '../../assets/images/patrick.png';


class userAvatar extends Component {
  editor: AvatarEditor;
  constructor(props) {
    super(props);
    let uid = this.props.id;
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.inputOpenFileRef = React.createRef();
    this.state = {
      server: server,
      users: server + 'users',
      user: server + 'users/',
      uid: uid,
      data: null,
      authenticated: this.toggleAuthenticateStatus,
      allowZoomOut: true,
      position: { x: 0.2, y: 0.2 },
      scale: 1,
      rotate: 0,
      borderRadius: 50,
      preview: null,
      width: 180,
      height: 180,
      initialAValues: {},
      image: src,
      file: null,
      fileName: '',
      isUploading: false,
      statusCode: '',
      modalOpen: false
    };
    this.handleDrop = this.handleDrop.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.toggleAuthenticateStatus = this.toggleAuthenticateStatus.bind(this);
  }
  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  handleNewImage = e => {
    this.setState({ image: e.target.files[0] });
  }
  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click()
  }
  handleSave = data => {
    const img = this.editor.getImageScaledToCanvas().toDataURL();
    const rect = this.editor.getCroppingRect();

    this.setState({
      modalOpen: true,
      preview: {
        img,
        rect,
        scale: this.state.scale,
        width: this.state.width,
        height: this.state.height,
        borderRadius: this.state.borderRadius,
      },
    });
  }

  handleScale = e => {
    const scale = parseFloat(e.target.value);
    this.setState({ scale });
  }

  handleAllowZoomOut = ({ target: { checked: allowZoomOut } }) => {
    this.setState({ allowZoomOut });
  }

  rotateLeft = e => {
    e.preventDefault();

    this.setState({
      rotate: this.state.rotate - 90,
    });
  }

  rotateRight = e => {
    e.preventDefault();
    this.setState({
      rotate: this.state.rotate + 90,
    });
  }

  handleBorderRadius = e => {
    const borderRadius = parseInt(e.target.value);
    this.setState({ borderRadius });
  }

  handleXPosition = e => {
    const x = parseFloat(e.target.value);
    this.setState({ position: { ...this.state.position, x } });
  }

  handleYPosition = e => {
    const y = parseFloat(e.target.value);
    this.setState({ position: { ...this.state.position, y } });
  }

  handleWidth = e => {
    const width = parseInt(e.target.value);
    this.setState({ width });
  }

  handleHeight = e => {
    const height = parseInt(e.target.value);
    this.setState({ height });
  }

  logCallback(e) {
    // eslint-disable-next-line
    console.log('callback', e);
  }

  setEditorRef = editor => {
    if (editor) this.editor = editor;
  }

  handlePositionChange = position => {
    this.setState({ position });
  }

  handleDrop = acceptedFiles => {
    this.setState({ image: acceptedFiles[0] });
  }
  handleOpen = () => this.setState({ modalOpen: true })
  handleClose = () => this.setState({ modalOpen: false })
  showOpenFileDlg = () => {
    this.inputOpenFileRef.current.click()
  }
  render() {
    return (
      <Container style={{textAlign: 'left'}}>
        <Segment>
          <Dropzone
            onDrop={this.handleDrop}
            disableClick
            multiple={false}
            style={{ width: this.state.width, height: this.state.height, marginBottom:'35px' }}
          >
            {({getRootProps}) => <AvatarEditor {...getRootProps()}

                ref={this.setEditorRef}
                scale={parseFloat(this.state.scale)}
                width={this.state.width}
                height={this.state.height}
                position={this.state.position}
                onPositionChange={this.handlePositionChange}
                rotate={parseFloat(this.state.rotate)}
                borderRadius={this.state.width / (100 / this.state.borderRadius)}
                onLoadFailure={this.logCallback.bind(this, 'onLoadFailed')}
                onLoadSuccess={this.logCallback.bind(this, 'onLoadSuccess')}
                onImageReady={this.logCallback.bind(this, 'onImageReady')}
                image={this.state.image}
                className="editor-canvas"
              />}
          </Dropzone>
          <br />
          <Input
            ref={this.inputOpenFileRef}
            id="avatar"
            placeholder="New File"
            name="newImage"
            type="file"
            onChange={this.handleNewImage}
          />
          <Button
            animated="fade"
            content="Choose File"
            labelPosition="left"
            icon="file"
            onClick={this.handleNewImage}
          />
        <br />
        Zoom:
        <Input
          name="scale"
          type="range"
          onChange={this.handleScale}
          min={this.state.allowZoomOut ? '0.1' : '1'}
          max="2"
          step="0.01"
          defaultValue="1"
        />
        <br />
        {'Allow Scale < 1'}
        <Input
          name="allowZoomOut"
          type="checkbox"
          onChange={this.handleAllowZoomOut}
          checked={this.state.allowZoomOut}
        />
        <br />
        Border radius:
        <Input
          name="scale"
          type="range"
          onChange={this.handleBorderRadius}
          min="0"
          max="50"
          step="1"
          defaultValue="0"
        />
        <br />
        Avatar Width:
        <Input
          name="width"
          type="number"
          onChange={this.handleWidth}
          min="50"
          max="400"
          step="10"
          value={this.state.width}
        />
        <br />
        Avatar Height:
        <Input
          name="height"
          type="number"
          onChange={this.handleHeight}
          min="50"
          max="400"
          step="10"
          value={this.state.height}
        />
        <br />
        X Position:
        <Input
          name="scale"
          type="range"
          onChange={this.handleXPosition}
          min="0"
          max="1"
          step="0.01"
          value={this.state.position.x}
        />
        <br />
        Y Position:
        <Input
          name="scale"
          type="range"
          onChange={this.handleYPosition}
          min="0"
          max="1"
          step="0.01"
          value={this.state.position.y}
        />
        <br />
        Rotate:
        <Button onClick={this.rotateLeft}>Left</Button>
        <Button onClick={this.rotateRight}>Right</Button>
        <br />
          <Modal
            trigger={<Button primary onClick={this.handleSave}
            open={this.state.modalOpen}
            onClose={this.handleClose}
             >Preview</Button>}>
              <Modal.Header>Preview Avatar</Modal.Header>
              <Modal.Content image>
                {!!this.state.preview && (
                  <Image
                    circular
                    wrapped
                    alt='avatar preview'
                    size='medium'
                    src={this.state.preview.img}
                    style={{ borderRadius: this.state.borderRadius }}
                  />
                )}
                {!!this.state.preview && (
                  <Modal.Description>
                      <Image
                        avatar
                        alt='avatar preview'
                        src={this.state.preview.img}
                        style={{ borderRadius: this.state.borderRadius }}
                      />
                    <span>User name </span>
                      <Placeholder style={{ height: 150, width: 150 }}>
                        <Placeholder.Image >
                          <Image
                            alt='avatar preview'
                            src={this.state.preview.img}
                            style={{ borderRadius: this.state.borderRadius }}
                          />
                        </Placeholder.Image>
                      </Placeholder>
                  </Modal.Description>
                )}
              </Modal.Content>
              <Modal.Actions>
                <Button  onClick={this.handleClose} color='red' >
                  <Icon name='cancel' /> cancel
                </Button>
                <Button onClick={this.handleSave} primary inverted>
                  <Icon name='save' /> Save
                </Button>
              </Modal.Actions>
          </Modal>
        </Segment>
      </Container>
    );
  }
}

export default injectIntl(userAvatar);
