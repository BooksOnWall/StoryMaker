import React, {useEffect, useState, useCallback } from 'react';
import {useDropzone} from 'react-dropzone';
import { FormattedMessage } from 'react-intl';


function StageImages(props){
  const [files, setFiles] = useState([]);
  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: 'image/*',
    minSize: 0,
    maxSize: 52428800,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        src: URL.createObjectURL(file)
      })));
      props.setStageObjects(acceptedFiles, 'stageImages');
    }
  });
  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.src));
  }, [files]);
    return (
      <div {...getRootProps({className: 'dropzone'})}>

        <input  id='stageImages' name='files' onChange={props.onChangeImagesHandler} ref={ref => this.fileInput = ref} {...getInputProps()} />
            <p>{<FormattedMessage id="app.story.stage.stageimages.files"  defaultMessage={"Drag and drop some files here, or click to select files"} />}</p>
          {!isDragActive && <FormattedMessage id="app.stage.stageimages.files.dragactive"  defaultMessage={"Click here or drop a file to upload!"} />}
          {isDragActive && !isDragReject &&  <FormattedMessage id="app.story.stage.stageimages.files.dragactive"  defaultMessage={"Drop it like it's hot!"} />}
          {isDragReject && <FormattedMessage id="app.story.stage.stageimages.files.dragreject"  defaultMessage={"File type not accepted, sorry!"} />}
      </div>
    );

}
export default StageImages;
