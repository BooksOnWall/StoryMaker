import React, {useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import {
  Segment,
  Placeholder,
  List,
  Image,
} from 'semantic-ui-react';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
};

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
};

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
};


function StagePictures(props) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({

    accept: 'image/*',
    minSize: 0,
    maxSize: 5242880,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      props.setPictures(acceptedFiles);
    }
  });

  const thumbs = files.map(file => (
    <List.Item key={file.name} className='slide-out'>
      <Image size='big' src={file.preview} />
      <List.Content>
        <List.Header>{file.name}</List.Header>
      </List.Content>
    </List.Item>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);


  return (
    <Segment.Group horizontal>
        <Segment className="container">
          <div {...getRootProps({className: 'dropzone'})}>
            <input  id='stagePictures' name='files' onChange={props.onChangeHandler} ref={ref => this.fileInput = ref} {...getInputProps()} />
            <p>Drag 'n' drop some files here, or click to select files</p>
            {!isDragActive && 'Click here or drop a file to upload!'}
            {isDragActive && !isDragReject && "Drop it like it's hot!"}
            {isDragReject && "File type not accepted, sorry!"}
          </div>
        </Segment>
        <Segment  className="stage">
          <Placeholder fluid>
            <Placeholder.Header image>
              <Placeholder.Line />
              <Placeholder.Line />
            </Placeholder.Header>
          </Placeholder>
          <aside style={thumbsContainer}>
            <List animated celled fluid verticalAlign='middle'>
              {thumbs}
            </List>
          </aside>
        </Segment>
      </Segment.Group>
  );
}
export default StagePictures;
