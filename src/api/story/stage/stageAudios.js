import React, {useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import {
  Segment,
} from 'semantic-ui-react';



function StageAudios(props) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({

    accept: 'audio/*',
    minSize: 0,
    maxSize: 52428800,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        src: URL.createObjectURL(file)
      })));
      props.setStageObjects(acceptedFiles, 'stageAudios');
    }
  });


  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.src));
  }, [files]);


  return (

      <Segment className="container">
        <div {...getRootProps({className: 'dropzone'})}>
<<<<<<< Updated upstream
          <input  id='stageAudios' name='files' onChange={(e) => this.props.onChangeObjectsHandler(e, 'stageAudios')} ref={ref => this.fileInput = ref} {...getInputProps()} />
          <p>Drag 'n' drop some files here, or click to select files</p>
          {!isDragActive && 'Click here or drop a file to upload!'}
          {isDragActive && !isDragReject && "Drop it like it's hot!"}
          {isDragReject && "File type not accepted, sorry!"}
=======
          <input  id='stageAudios' name='files' onChange={props.onChangeAudiosHandler} ref={ref => this.fileInput = ref} {...getInputProps()} />
            <p>{<FormattedMessage id="app.story.stage.stageaudios.files"  defaultMessage={"Drag and drop some files here, or click to select files"} />}</p>
          {!isDragActive && <FormattedMessage id="app.stage.stageaudios.files.dragactive"  defaultMessage={"Click here or drop a file to upload!"} />}
          {isDragActive && !isDragReject &&  <FormattedMessage id="app.story.stage.stageaudios.files.dragactive"  defaultMessage={"Drop it like it's hot!"} />}
          {isDragReject && <FormattedMessage id="app.story.stage.stageaudios.files.dragreject"  defaultMessage={"File type not accepted, sorry!"} />}
>>>>>>> Stashed changes
        </div>
      </Segment>

  );
}
export default StageAudios;
