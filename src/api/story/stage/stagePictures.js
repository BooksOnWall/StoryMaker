import React, {useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import { FormattedMessage } from 'react-intl';
import {
  Segment,
} from 'semantic-ui-react';



function StagePictures(props) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({

    accept: 'image/*',
    minSize: 0,
    maxSize: 5242880,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        src: URL.createObjectURL(file)
      })));
      props.setStageObjects(acceptedFiles, 'stagePictures');
    }
  });


  useEffect(() => () => {
    // Make sure to revoke the data uris to avoid memory leaks
    files.forEach(file => URL.revokeObjectURL(file.src));
  }, [files]);


  return (

      <Segment inverted  className='prueba'>
        <div {...getRootProps({className: 'dropzone'})}>
          <input  id='stagePictures' name='files' onChange={props.onChangePicturesHandler} ref={ref => this.fileInput = ref} {...getInputProps()} />

            <p>{<FormattedMessage id="app.story.stage.stagepicture.files"  defaultMessage={"Drag and drop some files here, or click to select files"} />}</p>
          {!isDragActive && <FormattedMessage id="app.story.stage.stagepicture.files.dragactive"  defaultMessage={"Click here or drop a file to upload!"} />}
          {isDragActive && !isDragReject &&  <FormattedMessage id="app.story.stage.stagepicture.files.dragactive.drop"  defaultMessage={"Drop it like it's hot!"} />}
          {isDragReject && <FormattedMessage id="app.story.stage.stagepicture.files.dragreject"  defaultMessage={"File type not accepted, sorry!"} />}
        </div>
      </Segment>

  );
}
export default StagePictures;
