import React, {useEffect, useState } from 'react';
import {useDropzone} from 'react-dropzone';
import {
  Segment,
  Image,
} from 'semantic-ui-react';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';
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
  width: 60,
  height: 60,
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


function GalleryPreviews(props) {
  const [files, setFiles] = useState([]);

  const { getRootProps, getInputProps } = useDropzone({

    accept: 'image/*',
    minSize: 0,
    maxSize: 5242880,
    onDrop: acceptedFiles => {
      // do nothing if no files
      if (acceptedFiles.length === 0) {
        return;
      } else if(acceptedFiles.length > 6){
        // here i am checking on the number of files
        return ToastsStore.error("No more than 6 images allowed") // here i am using react toaster to get some notifications. don't need to use it
      } else {
        // do what ever you want
        setFiles(acceptedFiles.map(file => Object.assign(file, {
          preview: URL.createObjectURL(file)
        })));
        props.state.setGalleryImages(acceptedFiles);
      }

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
    <Segment inverted style={{margin:0, padding: 0, display: props.state.galleryUploadDisplay}} >
      <div {...getRootProps({className: 'dropzone gallery'})} style={{display: props.state.galleryDropZoneDisplay}}>
        <input  id='themeGalleryFiles' name='files' onChange={props.state.onChangeGalleryHandler} ref={ref => this.fileInput = ref} {...getInputProps()} />
      </div>
      <aside style={thumbsContainer}  >
        {thumbs}
      </aside>
    <ToastsContainer store={ToastsStore} position={ToastsContainerPosition.TOP_LEFT}/>
    </Segment>
  );
}
export default GalleryPreviews;
