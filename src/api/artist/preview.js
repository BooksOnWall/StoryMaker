import React, {useEffect, useState, useCallback} from 'react';
import {useDropzone} from 'react-dropzone';
import {
  Button,
  Segment,
  Input,
  Image,
  Progress,
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


function Previews(props) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({

    accept: 'image/*',
    minSize: 0,
    maxSize: 5242880,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      props.state.setImages(acceptedFiles);
    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name} >
      <div style={thumbInner} className='slide-out'>
        <Image
          circular
          className='fadeIn'
          alt='preview'
          src={file.preview}
          style={img}
        />
      </div>
    </div>
  ));

  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.preview));
  }, [files]);


  return (
    <Segment className="container">
      <div {...getRootProps({className: 'dropzone'})}>
        <input  id='artistFiles' name='files' onChange={props.state.onChangeHandler} ref={ref => this.fileInput = ref} {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        {!isDragActive && 'Click here or drop a file to upload!'}
        {isDragActive && !isDragReject && "Drop it like it's hot!"}
        {isDragReject && "File type not accepted, sorry!"}
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>
    </Segment>
  );
}
export default Previews;
