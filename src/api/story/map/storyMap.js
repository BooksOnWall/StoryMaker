import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Segment,
  Dimmer,
  Loader,
  Tab,
  Card,
  Form,
  Icon,
  Modal,
  Image,
  Input,
  Button,
  Divider,
  Accordion
} from 'semantic-ui-react';
import { Formik } from 'formik';
import {  FormattedMessage } from 'react-intl';
import MapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MAP_STYLE from './map-style-basic-v8.json';
import StylePanel from './stylePanel';
import { ChromePicker } from 'react-color';
import BannerPreviews from '../theme/bannerPreview';
import GalleryPreviews from '../theme/galleryPreview';
import StoryPreview from '../theme/storyPreview';

let MapboxAccessToken = process.env.REACT_APP_MAT;

// Set bounds toMontevideo
var bounds = [
  [-34.9036749, -56.2189153], // Southwest coordinates
  [-34.9068829, -56.211639]  // Northeast coordinates
];
const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16
};
function Listimages(props) {
 if (!props.images || props.images.length === 0 ) return null;
 let images = (typeof(props.images) === 'string') ? JSON.parse(props.images) : props.images;
 const build = images.map((image, index) => {
   // switch oject structure from create to update
   return (
     <Card key={index} className='inverted'>
       <Card.Content>
         <Modal  basic dimmer='blurring' closeIcon
           onClose={props.handleModalImgDeleteClose}
           size='fullscreen'
           trigger={<Image floated='right' src={props.server + image.path} />} centered={true} >
           <Modal.Content image>
             <Image wrapped src={props.server + image.path} />
           </Modal.Content>
           <Modal.Actions>
             <Button name={image.name} color='red' onClick={props.handleImageGalleryDelete} inverted>
               <Icon name='checkmark' /> Remove
             </Button>
           </Modal.Actions>
         </Modal>
       </Card.Content>
     </Card>
   );
 });
 return build;
}
class storyMap extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      sid: (!this.props.sid) ? (0) : (parseInt(this.props.sid)),
      mapURL: server+'stories/'+this.props.sid+'/map',
      themeURL: server+'stories/'+this.props.sid+'/theme',
      dropImageGalleryURL: server+'stories/'+this.props.sid+'/drop',
      loading: null,
      mapStyle: MAP_STYLE,
      story: null,
      server: server,
      colors: {
        water: '#aad9f5',
        parks: '#2bedbd',
        buildings: '#2d2e23',
        roads: '#5a5050',
        labels: '#FFFFFF',
        background: '#02020e'
      },
      active: 'Map',
      saveMapLoading: false,
      bounds: bounds,
      viewport: {
        latitude: -34.9022229,
        longitude: -56.1670182,
        zoom: 13,
        bearing: -60, // bearing in degrees
        pitch: 60  // pitch in degrees
      },
      fonts: [
        'ATypewriterForMe',
        'BadScript-Regular',
        'OpenSansCondensed-Bold',
        'OpenSansCondensed-Light',
        'TrashHand',
        'Typewriterhand',
        'WaitingfortheSunrise'
      ],
      theme: {
        font1: 'TrashHand',
        font2: 'BadScript-Regular',
        font3: 'ATypewriterForMe',
        banner: {
          name: 'banner'+this.props.sid+'.png',
          path: 'assets/stories/'+this.props.sid + '/design/banner/banner' + this.props.sid +'.png',
        },
        gallery: [],
        color1: '#FFDDFF',
        color2: '#DD00FF',
        color3: '#00FFFF'
      },
      activeIndex: 0,
      saveThemeLoading: false,
      setBannerImages: this.setBannerImages,
      onChangeBannerHandler: this.onChangeBannerHandler,
      bannerDropZoneDisplay: 'block',
      bannerUploadDisplay: false,
      setGalleryImages: this.setGalleryImages,
      onChangeGalleryHandler: this.onChangeGalleryHandler,
      modalImgDelete: false,
      galleryDropZoneDisplay: 'block',
      galleryUploadDisplay: false,
      displayColorPicker1: false,
      displayColorPicker2: false,
      displayColorPicker3: false,
      banners: [],
      gallery: [],
      bannerSubmit: false,
      bannerThemeURL: server+'stories/'+this.props.sid+'/banner',
      galleryThemeURL: server+'stories/'+this.props.sid+'/gallery',
      gallerySubmit: false,
      setViewport: this.setViewport,
    }
    this.handleImageGalleryDelete = this.handleImageGalleryDelete.bind(this);
  };
  setViewport = (field, value ) => {
    this.setState({viewport: {
      latitude: this.state.viewport.latitude,
      longitude: this.state.viewport.longitude,
      zoom: (field === 'zoom') ? value: this.state.viewport.zoom ,
      bearing: (field === 'bearing') ? value: this.state.viewport.bearing ,
      pitch: (field === 'pitch') ? value: this.state.viewport.pitch ,
    }})
  }
  async componentDidMount() {
    // check if user is logged in on refresh
    try {
      await this.setState({loading: true});
      await this.state.toggleAuthenticateStatus;
      await this.getTheme();
      await this.getMapPreferences();

      //await this.setState({loading: true});
    } catch(e) {
      console.log(e.message);
    }
  }
  toggleLoading(val) {
    this.setState({loading: false});
  }
  getTheme = async () => {
    try {
      await fetch(this.state.themeURL, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
        if(data.theme.length > 0) {
          this.setState({theme: JSON.parse(data.theme)});
        }
      });
    } catch(e) {
      console.log(e.message);
    }
  }
  getMapPreferences = async () => {
    try {
      await fetch(this.state.mapURL, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}

        return response.json();
      })
      .then(data => {
          this.setState({loading: false});
          // console.log(data);
          if(data && data.map) {
            const map  = JSON.parse(data.map);
            const colors = {};
            map.style.layers.map((layer) => {
              let color = (layer.paint['background-color']) ? layer.paint['background-color'] : '';
              color = (layer.paint['fill-color']) ? layer.paint['fill-color'] : color;
              color = (layer.paint['line-color']) ? layer.paint['line-color'] : color;
              color = (layer.paint['text-color']) ? layer.paint['text-color'] : color;
              if(layer.paint) { colors[layer.id] = color ; }
              return layer;
            });
            this.setState({colors: colors, mapStyle: map.style, viewport: map.viewport});
          } else {
            console.log('No Data received from the server');
            return this.saveMapPrefs();
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
  saveMapPrefs = async () => {
    try {
      this.setState({saveMapLoading: true});
      let prefs = {
        style: this.state.mapStyle,
        viewport: this.state.viewport
      };
      await fetch(this.state.mapURL, {
        method: 'post',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body: JSON.stringify({prefs:prefs})
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({saveMapLoading: false});
            this.getMapPreferences();
          } else {
            console.log('No Data received from the server');
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
  saveTheme = async () => {
    try {
      this.setState({saveThemeLoading: true});
      let theme = this.state.theme;
      await fetch(this.state.themeURL, {
        method: 'post',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body: JSON.stringify({design_options:theme})
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({saveThemeLoading: false});
          } else {
            console.log('No Data received from the server');
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
  setBannerImages = (files) => {
    const banner = {
      name: files[0].name,
      path: 'assets/stories/'+ this.props.sid + '/design/banner/' + files[0].path,
      size: files[0].size,
      type: files[0].type
    }
    this.setState({
    bannerDropZoneDisplay: 'none',
    banners: { files },
    theme : {
      banner: banner ,
      font1: this.state.theme.font1,
      font2: this.state.theme.font2,
      font3: this.state.theme.font3,
      gallery: this.state.theme.gallery,
      color1: this.state.theme.color1,
      color2: this.state.theme.color2,
      color3: this.state.theme.color3
  }});
}
  setGalleryImages = (files) => {
    this.setState({
      galleryDropZoneDisplay: 'none',
      gallery: { files },
    });
  }

  editBanner(values) {
    return (

      <div>
        <aside style={thumbsContainer}>
          <Image src={this.state.server + this.state.theme.banner.path} />
        </aside>
        {this.state.bannerUploadDisplay &&
          <div>
            <BannerPreviews state={this.state} />
            <Button onClick={this.handleSubmitBanner} floated='right' primary size='large' type="submit" disabled={this.state.bannerSubmit} loading={this.state.bannerSubmit}>
               Update
            </Button>
          </div>
        }
        <Divider />
      </div>
    );
  }
  handleSubmitBanner = async (e) => {
      this.setState({bannerSubmit: true});

      let images = this.state.banners;
      try {
        let formData = new FormData();
        for(var x = 0; x < images.files.length; x++) {
          formData.append('file', images.files[x]);
        };
        await fetch(this.state.bannerThemeURL, {
          method: 'POST',
          credentials: 'same-origin',
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Accept':'application/json; charset=utf-8'
          },
          file: JSON.stringify(images.files[0]),
          body: formData
         })
         .then(response => response.json())
         .then(data => {
            this.setState({
              bannerSubmit: false,
              bannerUploadDisplay: false
            });
         });
      } catch(e) {
        console.log(e.message);
      }
  }
  handleSubmitGallery = async (e) => {
    this.setState({gallerySubmit: true});

    let images = this.state.gallery;
    try {
      let formData = new FormData();
      for(var x = 0; x < images.files.length; x++) {
        formData.append('file', images.files[x]);
      };
      await fetch(this.state.galleryThemeURL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept':'application/json; charset=utf-8'
        },
        files: JSON.stringify(images.files),
        body: formData
       })
       .then(response => response.json())
       .then(data => {
         let gimages =[];
         if (this.state.gallery.files  && this.state.gallery.files.length > 0) {
           //prepare aray of image name and path for store and let the rest for updateImages
           Array.from(this.state.gallery.files).forEach(file => {
             gimages.push({
                 'name': file.name,
                 'size': file.size,
                 'type': file.type,
                 'path': 'assets/stories/'+ this.props.sid + '/design/gallery/' + file.name
             });
           });
          }
          this.setState({
            gallerySubmit: false,
            galleryUploadDisplay: false,
            gallery: [],
            theme: {
              banner: this.state.theme.banner,
              font1: this.state.theme.font1,
              font2: this.state.theme.font2,
              font3: this.state.theme.font3,
              gallery: gimages,
              color1: this.state.theme.color1,
              color2: this.state.theme.color2,
              color3: this.state.theme.color3
            }
          });
       });
    } catch(e) {
      console.log(e.message);
    }
  }
  toggleBannerUpload = () => this.setState({bannerUploadDisplay: !this.state.bannerUploadDisplay})
  toggleGalleryUpload = () => this.setState({galleryUploadDisplay: !this.state.galleryUploadDisplay, galleryDropZoneDisplay: 'block'})
  onChangeBannerHandler = event => this.setState({ banner: event.target.files })
  onChangeGalleryHandler = event => this.setState({ gallery: event.target.files })
  handleImageGalleryDelete = (e) => {
    const imgName = e.target.name;
    let images = (typeof(this.state.theme.gallery) === 'string') ? JSON.parse(this.state.theme.gallery) : this.state.theme.gallery ;
    // remove image object from images array
    images = images.filter(function(e) {
      return e.name !== imgName;
    });
    this.setState({
      theme: {
        gallery: images,
        banner: this.state.theme.banner,
        font1: this.state.theme.font1,
        font2: this.state.theme.font2,
        font3: this.state.theme.font3,
        color1: this.state.theme.color1,
        color2: this.state.theme.color2,
        color3: this.state.theme.color3
      }});
    // delete array and file server side
    return this.dropGalleryImage(imgName, images);
  }
  dropGalleryImage = async (name, images) => {
    try {
      await fetch(this.state.dropImageGalleryURL, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {'Access-Control-Allow-Origin': '*',  'Content-Type':'application/json'},
        body:JSON.stringify({
          name: name,
          images: images,
        })
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            // close modal window
            console.log(data); // to be send later in messages
            // redirect
            //this.props.history.push('/artists');
          }
      }).catch(error => console.log(error));
    } catch(e) { console.log(e.message); }
  }
  handleImgDeleteOpen = () => this.setState({ modalImgDelete: true })
  handleModalImgDeleteClose = () =>  this.setState({ modalImgDelete: false })
  editGallery(values) {
    return (
      <div>
        <aside style={thumbsContainer}>
          <Card.Group itemsPerRow={2}>
            {(this.state.theme.gallery && this.state.theme.gallery.length > 0) ? <Listimages  handleImageGalleryDelete={this.handleImageGalleryDelete} handleImgDeleteOpen={this.handleImgDeleteOpen} handleModalImgDeleteClose={this.handleModalImgDeleteClose}  state={this.state} images={this.state.theme.gallery} server={this.state.server}/> : ''}
          </Card.Group>
        </aside>
        {this.state.galleryUploadDisplay &&
          <div>
            <GalleryPreviews state={this.state} />
            <Button onClick={this.handleSubmitGallery} floated='right' primary size='large' type="submit" disabled={this.state.gallerySubmit} loading={this.state.gallerySubmit} >
              Update
            </Button>
          </div>
        }
      </div>
    );
  }
  onViewportChange = (viewport) => this.setState({viewport})
  onStyleChange = (mapStyle) => this.setState({mapStyle})
  preview = () => {
    return (
      <Tab.Pane attached={false} inverted>
        <StoryPreview server={this.state.server} theme={this.state.theme} story={this.state.story}/>
      </Tab.Pane>
    )
  }
  mapPrefs = () => {
    if (this.state.colors) {
      return (
        <Tab.Pane attached={false} inverted>
          <StylePanel
            colors={this.state.colors}
            setViewport={this.setViewport}
            viewport={this.state.viewport}
            containerComponent={this.props.containerComponent}
            onChange={this.onStyleChange}
          />
          <Divider />
          <Button fluid loading={this.state.saveMapLoading} onClick={this.saveMapPrefs} primary>
          <FormattedMessage id="app.story.map.savemappref" defaultMessage={`Save Map Preferences`}/></Button>
        </Tab.Pane>
      )
    }
  }
  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }
  handleFocus1 = () => this.setState({ displayColorPicker1: !this.state.displayColorPicker1 })
  handleFocus2 = () => this.setState({ displayColorPicker2: !this.state.displayColorPicker2 })
  handleFocus3 = () => this.setState({ displayColorPicker3: !this.state.displayColorPicker3 })
  handleClose1 = () => this.setState({ displayColorPicker1: false })
  handleClose2 = () => this.setState({ displayColorPicker2: false })
  handleClose3 = () => this.setState({ displayColorPicker3: false })
  handleColor1 = (color) => this.setState({
    theme: {
      banner: this.state.theme.banner,
      font1: this.state.theme.font1,
      font2: this.state.theme.font2,
      font3: this.state.theme.font3,
      gallery: this.state.theme.gallery,
      color1: color.hex,
      color2: this.state.theme.color2,
      color3: this.state.theme.color3
    }
  })
  handleColor2 = (color) => this.setState({ theme: {
    banner: this.state.theme.banner,
    font1: this.state.theme.font1,
    font2: this.state.theme.font2,
    font3: this.state.theme.font3,
    gallery: this.state.theme.gallery,
    color1: this.state.theme.color1,
    color2:  color.hex,
    color3: this.state.theme.color3
  } })
  handleColor3 = (color) => this.setState({ theme: {
    banner: this.state.theme.banner,
    font1: this.state.theme.font1,
    font2: this.state.theme.font2,
    font3: this.state.theme.font3,
    gallery: this.state.theme.gallery,
    color1: this.state.theme.color1,
    color2: this.state.theme.color2,
    color3: color.hex
  } })

  themePrefs = () => {
     const { activeIndex } = this.state;
     const popover = {
      position: 'absolute',
      zIndex: '2',
    };
    const cover = {
      position: 'fixed',
      top: '0px',
      right: '0px',
      bottom: '0px',
      left: '0px',
    };
    return (
      <Tab.Pane attached={false} inverted>
        <Formik
          enableReinitialize={true}
          initialValues={this.state.theme}
          validate={values => {
            let errors = {};
            return errors;
          }}
          onSubmit={(values, { setSubmitting }) => {
            this.saveTheme(values);

            setTimeout(() => {
              //alert(JSON.stringify(values, null, 2));

              setSubmitting(false);
            }, 400);
          }}
          >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            handleSubmit,
            handleDelete,
            isSubmitting,
            /* and other goodies */
          }) => (
            <Form inverted size='large' onSubmit={this.handleSubmit}>
              <Accordion inverted fluid>
               <Accordion.Title
                 active={activeIndex === 0}
                 index={0}
                 onClick={this.handleClick}
               >
                 <Icon name='dropdown' />
                FONT
               </Accordion.Title>
               <Accordion.Content active={activeIndex === 0}>
                 <span className='label small'>Font 1: </span><br/>
                 <select
                   size='small'
                   name="font"
                   type="select"
                   className="fontSelect"
                   defaultValue={this.state.theme.font1}
                   onChange={this.handleChange}
                   >
                   <option key={0} disabled hidden value=''></option>
                   {this.state.fonts.map(font => <option key={font} value={font} style={{fontFamily: font}} > {font} </option>)}
                 </select>
                 <Divider/>
                 <span className='label small'>Font 2 : </span><br/>
                 <select
                   size='small'
                   name="font2"
                   type="select"
                   defaultValue={this.state.theme.font2}
                   onChange={this.handleChange}
                   >
                   <option key={0} disabled hidden value=''></option>
                   {this.state.fonts.map(font => <option key={font} value={font} >{font}</option>)}
                 </select>
                 <Divider/>
                 <span className='label small'>Font 3: </span><br/>
                 <select
                   size='small'
                   name="font3"
                   type="select"
                   defaultValue={this.state.theme.font3}
                   onChange={this.handleChange}
                   >
                   <option key={0} disabled hidden value=''></option>
                   {this.state.fonts.map(font => <option key={font} value={font} >{font}</option>)}
                 </select>
                 <Divider/>
               </Accordion.Content>
               <Accordion.Title
                 active={activeIndex === 1}
                 index={1}
                 onClick={this.handleClick}
               >
                 <Icon name='dropdown' />
                COLOR
               </Accordion.Title>
               <Accordion.Content active={activeIndex === 1}>
                 <Input
                 fluid
                 transparent
                 inverted
                 label={<FormattedMessage id="app.story.color1" defaultMessage={'Color 1'}/>}
                 icon='point'
                 iconposition='right'
                 placeholder={<FormattedMessage id="app.story.color1" defaultMessage={'Color 1'}/>}
                 type="text"
                 name="color1"
                 onChange={handleChange}
                 onBlur={handleBlur}
                 style={{backgroundColor: this.state.theme.color1 }}
                 onClick={this.handleFocus1}
                 defaultValue={this.state.theme.color1}
                   />
                 {errors.color1 && touched.color1 && errors.color1}
                 { this.state.displayColorPicker1 ? <div style={ popover }>
                    <div style={ cover } onClick={ this.handleClose1 }/>
                    <ChromePicker color={ this.state.theme.color1 }  onChangeComplete={ this.handleColor1 }/>
                  </div> : null }
                 <Divider/>
                 <Input
                 fluid
                 transparent
                 inverted
                 label={<FormattedMessage id="app.story.color2" defaultMessage={'Color 2'}/>}
                 icon='point'
                 iconposition='right'
                 placeholder={<FormattedMessage id="app.story.color2" defaultMessage={'Color 2'}/>}
                 type="text"
                 name="color2"
                 onChange={handleChange}
                 onBlur={handleBlur}
                 onClick={this.handleFocus2}
                 style={{backgroundColor: this.state.theme.color2 }}
                 defaultValue={this.state.theme.color2}
                   />
                 {errors.color2 && touched.color2 && errors.color2}
                 { this.state.displayColorPicker2 ? <div style={ popover }>
                    <div style={ cover } onClick={ this.handleClose2 }/>
                    <ChromePicker color={ this.state.theme.color2 }  onChangeComplete={ this.handleColor2 }/>
                  </div> : null }
                 <Divider/>
                 <Input
                 fluid
                 transparent
                 inverted
                 label={<FormattedMessage id="app.story.color3" defaultMessage={'Color 3'}/>}
                 icon='point'
                 iconposition='right'
                 placeholder={<FormattedMessage id="app.story.color3" defaultMessage={'Color 3'}/>}
                 type="text"
                 name="color3"
                 onChange={handleChange}
                 onBlur={handleBlur}
                 onClick={this.handleFocus3}
                 style={{backgroundColor: this.state.theme.color3 }}
                 defaultValue={this.state.theme.color3}
                   />
                 {errors.color3 && touched.color3 && errors.color3}
                 { this.state.displayColorPicker3 ? <div style={ popover }>
                    <div style={ cover } onClick={ this.handleClose3 }/>
                    <ChromePicker color={ this.state.theme.color3 }  onChangeComplete={ this.handleColor3 }/>
                  </div> : null }
                 <Divider/>
               </Accordion.Content>
               <Accordion.Title
                 active={activeIndex === 2}
                 index={2}
                 onClick={this.handleClick}
               >
                 <Icon name='dropdown' />
                IMAGES
               </Accordion.Title>
               <Accordion.Content active={activeIndex === 2}>
                 <Input
                 fluid
                 transparent
                 inverted
                 label={<FormattedMessage id="app.story.banner" defaultMessage={'Banner'}/>}
                 icon='pencil alternate'
                 iconposition='right'
                 placeholder={<FormattedMessage id="app.story.banner" defaultMessage={'Banner'}/>}
                 autoFocus={true}
                 type="text"
                 name="banner"
                 onClick={this.toggleBannerUpload}
                 onChange={handleChange}
                 onBlur={handleBlur}
                 defaultValue={this.state.theme.banner}
                />
                 {this.editBanner()}
                 <Input
                   fluid
                   transparent
                   inverted
                   label={<FormattedMessage id="app.story.gallery" defaultMessage={'Gallery'}/>}
                   icon='pencil alternate'
                   iconposition='right'
                   placeholder={<FormattedMessage id="app.story.gallery" defaultMessage={'Gallery'}/>}
                   autoFocus={true}
                   type="text"
                   name="gallery"
                   onClick={this.toggleGalleryUpload}
                   onChange={handleChange}
                   onBlur={handleBlur}
                   defaultValue={this.state.theme.gallery}
                   />
                 {this.editGallery()}
                 {errors.gallery && touched.gallery && errors.gallery}
                 <Divider/>
               </Accordion.Content>
             </Accordion>
          </Form>
        )}
      </Formik>
        <Divider />
        <Button fluid loading={this.state.saveThemeLoading} onClick={this.saveTheme} primary>
        <FormattedMessage id="app.story.map.savetheme" defaultMessage={`Save Theme`}/></Button>
      </Tab.Pane>
    )
  }
  render() {

    const {viewport, mapStyle, loading} = this.state;
    const panes = [
      {
        menuItem: 'Theme',
        render: () => this.themePrefs(),
      },
      {
        menuItem: 'Map',
        render: () => this.mapPrefs(),
      },
      {
        menuItem: 'View',
        render: () => this.preview(),
      }
    ];
    return (
      <Dimmer.Dimmable as={Segment} blurring dimmed={loading}>
          <Dimmer active={loading} onClickOutside={this.handleHide} />
          <Loader active={loading} ><FormattedMessage id="app.story.map.getmapinfo" defaultMessage={`Get map info`}/></Loader>
            <Segment  className="view map" >
              <MapGL
                {...viewport}
                width="94.5vw"
                height="79.3vh"
                mapStyle={mapStyle}
                onViewportChange={this.onViewportChange}
                mapboxApiAccessToken={MapboxAccessToken}
              >
                <Segment className='mapPref' inverted style={{ width: '19vw', height: '79.3vh', float: 'left'}}>
                   <Tab menu={{ inverted: true, pointing: true }} panes={panes} />
                </Segment>
              </MapGL>
          </Segment>
        </Dimmer.Dimmable>
    );
  }
}
export default withRouter(storyMap);
