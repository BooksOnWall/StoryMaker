import React, {useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import {
  Segment,
  Image,
} from 'semantic-ui-react';

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 0
};

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 210,
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


function BannerPreviews(props) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({

    accept: 'image/*',
    minSize: 0,
    maxSize: 5242880,
    onDrop: acceptedFiles => {
      setFiles(acceptedFiles.map(file => Object.assign(file, {
        preview: URL.createObjectURL(file)
      })));
      props.state.setBannerImages(acceptedFiles);
    }
  });

  const thumbs = files.map(file => (
    <div style={thumb} key={file.name} >
      <div style={thumbInner} className='slide-out'>
        <Image
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
    <Segment style={{margin:0, padding: 0}} inverted>

      <div {...getRootProps({className: 'dropzone banner'})} style={{ display: props.state.bannerDropZoneDisplay}}>
        <input  id='themeBannerFiles' name='files' onChange={props.state.onChangeHandler} ref={ref => this.fileInput = ref} {...getInputProps()} />
      </div>
      <aside style={thumbsContainer}>
        {thumbs}
      </aside>

    </Segment>
  );
}
export default BannerPreviews;
