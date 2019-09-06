import React, {useEffect, useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import {
  Segment,
  Placeholder,
  Icon,
  Button,
  List,
  Image,
} from 'semantic-ui-react';

function StageImages(props){
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: 'image/*',
    minSize: 0,
    maxSize: 52428800,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      props.setStageImages(acceptedFiles);
    }
  });

    return (
      <div {...getRootProps({className: 'dropzone'})}>
        <input  id='stageImages' name='files' onChange={props.onChangeImagesHandler} ref={ref => this.fileInput = ref} {...getInputProps()} />
        <p>Drag 'n' drop some files here, or click to select files</p>
        {!isDragActive && 'Click here or drop a file to upload!'}
        {isDragActive && !isDragReject && "Drop it like it's hot!"}
        {isDragReject && "File type not accepted, sorry!"}
      </div>
    );

}
export default StageImages;
