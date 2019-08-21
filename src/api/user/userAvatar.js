import React, { Component } from 'react';
import AvatarEditor from 'react-avatar-editor';
import Dropzone from 'react-dropzone';
import Auth from '../../module/Auth';
import { injectIntl, FormattedMessage } from 'react-intl';

import {
  Button,
  Input,
  Icon,
  Modal,
  Image,
  Container,
  Placeholder,
  Segment,
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
    let users = server + 'users';
    let userPreferences = users + '/' + uid + '/prefs';
    this.inputOpenFileRef = React.createRef();
    //console.log(this.props.state.user.avatar);
    let avatar_path = props.state.user.avatar;
    avatar_path = (avatar_path) ? server + avatar_path.substring(1) : null;
    console.log(avatar_path);
    this.state = {
      server: server,
      users: users,
      user: server + 'users/',
      uid: uid,
      data: null,
      userUpload: users + '/' + uid +'/upload',
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      userPreferences: userPreferences,
      allowZoomOut: true,
      position: { x: 0.2, y: 0.2 },
      scale: 1,
      rotate: 0,
      borderRadius: 50,
      preview: null,
      width: 180,
      height: 180,
      initialAValues: {},
      image: (avatar_path) ? avatar_path : src,
      file: null,
      fileName: '',
      isUploading: false,
      statusCode: '',
      modalOpen: false
    };
    this.handleDrop = this.handleDrop.bind(this);
    this.handleOpen = this.handleOpen.bind(this);
    this.handleClose = this.handleClose.bind(this);
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
    //this.props.state.avatar = img;
    this.setState({
      modalOpen: false,
      preview: {
        img,
        rect,
        scale: this.state.scale,
        width: this.state.width,
        height: this.state.height,
        borderRadius: this.state.borderRadius,
      },
    });
    this.saveAvatarPreference(img);
  }
  dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);
    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var dw = new DataView(ab);
    for(var i = 0; i < byteString.length; i++) {
      dw.setUint8(i, byteString.charCodeAt(i));
    }
    // write the ArrayBuffer to a blob, and you're done
    return new Blob([ab], {type: mimeString});
  }
  async saveAvatarPreference(img) {
      this.setState({'avatar': img});
      let uid = this.props.id;
      try {
        //transform image uri hash to file
        let image = this.dataURItoBlob(img);
        let path = '/images/users/' + uid +'/avatar.png';
        //upload image to server and store the returned image path in avatar userPreference
        await this.uploadAvatar(image, 'avatar.png');
        await fetch(this.state.userPreferences , {
          method: 'PATCH',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json', charset:'utf-8' },
          body:JSON.stringify({
            uid: uid,
            pref: 'avatar',
            pvalue: path,
          })
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              // if user is the one logged then change it's user preferences
              if (parseInt(this.props.state.user.uid) === parseInt(uid) ) {
                // store avatar in localStorage
                Auth.updateAvatar(path);
                // update user Preferences
                this.props.setAvatar(path);
              } else {
                // redirect to users list page
                this.props.history.push('/users');
              }
            }
        })
        .catch((error) => {
          // Your error is here!
          console.log(error)
        });
      } catch(e) {
        console.log(e.message);
    }


  }
  uploadAvatar = async (blob, name) => {
    // prepare image name and path for store
     let files = [];

    try {
      this.setState({loading: true});
      let formData = new FormData();
      var file = new File([blob], name, ({type: blob.type}));
      formData.append('files[]',file, name);
      files.push(file);

      await fetch(this.state.userUpload, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept':'application/json; charset=utf-8'
        },
        files: JSON.stringify(files),
        body: formData
       })
       .then(response => response.json())
       .then(data => {
          return data;
       });

    } catch(e) {
      console.log(e.message);
    }
  }
  handlePreview = data => {
    const img = this.editor.getImageScaledToCanvas().toDataURL();
    const rect = this.editor.getCroppingRect();
    //this.props.state.avatar = img;
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
  async componentDidMount() {
    try {
      await this.state.toggleAuthenticateStatus;
    } catch(e) {
      console.log(e.message);
    }
  }
  render() {
    console.log(this.state.image);
    return (
      <Container  fluid className="view" style={{textAlign: 'left'}}>
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
            trigger={<Button primary onClick={this.handlePreview}>Preview</Button>}
            open={this.state.modalOpen}
            onClose={this.handleClose}
            basic
            size='small'
          >
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
