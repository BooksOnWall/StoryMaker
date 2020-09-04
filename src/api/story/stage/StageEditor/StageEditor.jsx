import React, { Component, createRef } from 'react';
import {
  Select,
  Input,
  Button,
  Header,
  Segment,
  Image,
  TransitionablePortal,
} from 'semantic-ui-react';
import { Slider } from "react-semantic-ui-range";
import Portal from '../../../../assets/images/portal.jpg';
import Editor3d from '../../Editor3d/Editor3d';
import ReactPlayer  from 'react-player';

const sceneOptions = [
  { key: 1, value: 1, text: 'Video inside Picture' },
  { key: 2, value: 2, text: 'Video aside anchored picture' },
  { key: 3, value: 3, text: 'Video aside anchored with multiple pictures' },
  { key: 4, value: 4, text: 'Portal' },
  { key: 5, value: 5, text: 'Picture inside Video' },
  { key: 6, value: 6, text: 'Pictures inside Video' },
  { key: 7, value: 7, text: '3D Scene' }
];
const PIV = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePosition, sceneType, meters2pixels, alignItems}) => {
  return (<>
    <div style={{position: 'absolute', left: '50px', bottom: '60px', minHeight: meters2pixels(picturePosition.height), minWidth: meters2pixels(picturePosition.width), zIndex: 1001}}>
      {dimension && picture && (videoPosition.mode === "left" || videoPosition.mode === "top")  &&
        <div style={{width: meters2pixels(picturePosition.width), height:meters2pixels(picturePosition.height) , alignSelf: alignItems, marginTop: picturePosition.top, marginBottom: picturePosition.bottom}}>
          <Image style={{width: meters2pixels(picturePosition.width), height:meters2pixels(picturePosition.height)}} src={picture.src} />
        </div>
      }
    </div>
    {video &&
      <div style={{maxWidth: '45vw', marginLeft: meters2pixels(videoPosition.left), marginTop: meters2pixels(videoPosition.top), marginRight: meters2pixels(videoPosition.right), marginBottom: meters2pixels(videoPosition.bottom)}} className="draggable">
        <ReactPlayer
          playsinline={true}
          playing={video.autoplay}
          preload="false"
          light={false}
          name={video.name}
          muted={false}
          controls={true}
          loop={video.loop}
          width='100%'
          height='35vh'
          pip={true}
          seeking="true"
          config={{file: {
            attributes:  {
              crossOrigin: 'anonymous',
              width: '100%',
              height: 'auto'
            },
            forceVideo: true
          }
        }}

        id={"video_position" }
        key={"vid_position" }
        url={video.src}
      />
      </div>

    }


    </>);
}
const VIP = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePosition, sceneType, meters2pixels, alignItems}) => {
  const ratioIze = (value, width, height) => {
    let ratio = (height/width);
    value = value.split("vh")[0];
    console.log('value', value);
    console.log('ratio', ratio);
    console.log('res', (value * ratio));
    return (value * ratio)+'vh';
  }
  return (
    <>
    <Image src={picture.src} style={{position: 'absolute', bottom: '0vh', maxHeight: '35vh', minHeight: '35vh', minWidth : ratioIze('35vh', picturePosition.width, picturePosition.height ), zIndex: 998, width: meters2pixels(picturePosition.width), height: meters2pixels(picturePosition.height) }}/>
      <div style={{position: 'absolute', bottom: '0vh', maxHeight: '35vh', zIndex: 999,width: ratioIze('35vh', picturePosition.width, picturePosition.height ), height: '35vh' }}>
        <ReactPlayer
          playsinline={true}
          playing={video.autoplay}
          preload="true"
          light={false}
          name={video.name}
          muted={false}
          controls={true}
          loop={video.loop}
          width={ratioIze('35vh', picturePosition.width, picturePosition.height )}
          height="35vh"
          pip={true}
          seeking="true"
          config={{file: {
            attributes:  {
              crossOrigin: 'anonymous',
              width: ratioIze('35vh', picturePosition.width, picturePosition.height ),
              height: '35vh'
            },
            forceVideo: true
          }
        }}

        id={"video_position" }
        key={"vid_position" }
        url={video.src}
      />
      </div>
      </>
  );
}
const PAV = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePosition, sceneType, meters2pixels, alignItems}) => {
  return (<>
    {dimension && picture && (videoPosition.mode === "left" || videoPosition.mode === "top")  &&
      <div style={{width: meters2pixels(picturePosition.width), height: meters2pixels(picturePosition.height), alignSelf: alignItems, marginTop: picturePosition.top, marginBottom: picturePosition.bottom}}>
        <Image style={{width: meters2pixels(picturePosition.width), height: meters2pixels(picturePosition.height)}} src={picture.src} />
      </div>
    }
    {video &&
      <div style={{width: meters2pixels(videoPosition.width), height: meters2pixels(videoPosition.height),  marginLeft: meters2pixels(videoPosition.left), marginTop: meters2pixels(videoPosition.top), marginRight: meters2pixels(videoPosition.right), marginBottom: meters2pixels(videoPosition.bottom)}} className="draggable">
        <ReactPlayer
          playsinline={true}
          playing={video.autoplay}
          preload="true"
          light={false}
          name={video.name}
          muted={false}
          controls={true}
          loop={video.loop}
          width={meters2pixels(videoPosition.width)}
          height={meters2pixels(videoPosition.height)}
          pip={true}
          seeking="true"
          config={{file: {
            attributes:  {
              crossOrigin: 'anonymous',
              width: meters2pixels(videoPosition.width),
              height: meters2pixels(videoPosition.height)
            },
            forceVideo: true
          }
        }}

        id={"video_position" }
        key={"vid_position" }
        url={video.src}
      />
      </div>

    }
    {dimension && picture && (videoPosition.mode === "right" || videoPosition.mode === "bottom" ) &&
      <div style={{width: meters2pixels(picturePosition.width),height: meters2pixels(picturePosition.height), alignSelf: alignItems, marginTop: picturePosition.top, marginBottom: picturePosition.bottom}} className="draggable">
        <Image style={{width: meters2pixels(picturePosition.width),height: meters2pixels(picturePosition.height)}} src={picture.src} />
      </div>
    }
  </>)
}
const WallCanvas = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePosition, sceneType}) =>  {
  const meters2pixels = (meters) => (meters*30);
  let display = (videoPosition.mode === 'left' || videoPosition.mode === 'right') ? 'flex' : 'block';
  let alignItems = (videoPosition.mode === 'left' || videoPosition.mode === 'right') ? 'flex-end' : 'start';
  let justifyContent = (videoPosition.mode === 'left' || videoPosition.mode === 'right') ? 'initial' : 'center';
  justifyContent = (sceneType === 7) ? 'center' : justifyContent;
  alignItems = (sceneType === 7) ? 'stretch' : alignItems;
  return (
    <Segment style={{justifyContent: justifyContent, alignItems: alignItems, minHeight: '35vh', display: display, flexWrap: 'wrap', padding: 0}}>
      {(sceneType === 1) && <VIP meters2pixels={meters2pixels} alignItems={alignItems} dimension={dimension} picture={picture} video={video} videoPosition={videoPosition} picturePosition={picturePosition} handlePositionChange={handlePositionChange} savePosition={savePosition} sceneType={sceneType}/>}
      {(sceneType === 2  || sceneType === 3) && <PAV meters2pixels={meters2pixels} alignItems={alignItems} dimension={dimension} picture={picture} video={video} videoPosition={videoPosition} picturePosition={picturePosition} handlePositionChange={handlePositionChange} savePosition={savePosition} sceneType={sceneType}/>}
      {(sceneType === 5 || sceneType === 6) && <PIV meters2pixels={meters2pixels} alignItems={alignItems} dimension={dimension} picture={picture} video={video} videoPosition={videoPosition} picturePosition={picturePosition} handlePositionChange={handlePositionChange} savePosition={savePosition} sceneType={sceneType}/>}
      {(sceneType === 4) && <Image src={Portal} style={{maxWidth: '70vw', maxHeight: '30vh'}}/>}
      {(sceneType === 7) && <Editor3d  />}
    </Segment>
  );
};
const PivConfig = ({picturePosition,handlePicturePosition, leftSettings, rightSettings, handleBlur, topSettings, bottomSettings }) => {
  return (
    <div>

      <Input
        fluid
        inverted
        transparent
        label='Left'
        placeholder='Left'
        type="text"
        name="left"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'left')}
        onBlur={e => handleBlur}
        value={picturePosition.left}
        />
      <Slider color="grey" name="left" value={picturePosition.left} primary settings={leftSettings} />


      <Input
        fluid
        inverted
        transparent
        label='Right'
        placeholder='Right'
        type="text"
        name="right"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'right')}
        onBlur={e => handleBlur}
        value={picturePosition.right}
        />
      <Slider color="grey" name="right" value={picturePosition.right} primary settings={rightSettings} />


      <Input
        fluid
        inverted
        transparent
        label='Top'
        placeholder='Top'
        type="text"
        name="top"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'top')}
        onBlur={e => handleBlur}
        value={picturePosition.top}
        />
      <Slider color="grey" name="top" value={picturePosition.top} primary settings={topSettings} />

    <Input
          fluid
          inverted
          transparent
          label='Bottom'
          placeholder='Bottom'
          type="text"
          name="bottom"
          onChange={e => handlePicturePosition(e.currentTarget.value, 'bottom')}
          onBlur={e => handleBlur}
          value={picturePosition.bottom}
          />
        <Slider color="grey" name="bottom" value={picturePosition.bottom} primary settings={bottomSettings} />

  </div>
  );
}
const VideoConfig = ({stage, videoPosition, picturePosition, animation, duration, open, handleBlur, leftSettings, rightSettings, topSettings, bottomSettings, handleVideoPosition, handlePicturePosition, switchVideoPosition, switchPicture, toggleArType, switchArType, saveVideoposition, pIndex, widthSettings, heightSettings, pwidthSettings, pheightSettings}) => {
  const positionOptions = [
    { key: 'left', value: 'left', text: 'Left' },
    { key: 'right', value: 'right', text: 'Right' },
    { key: 'top', value: 'top', text: 'Top' },
    { key: 'bottom', value: 'bottom', text: 'Bottom' }
  ];

  const pictures = (stage.pictures && stage.pictures.length > 0) ? stage.pictures.map((p,i) => {
    p.text = "Picture "+(i+1);
    p.value = i;
      return p;
  }): null;
  console.log('scene_type',stage.scene_type);
  return (
    <TransitionablePortal
     open={open}
     transition={{ animation, duration }}
   >
    <>
     <Segment
       inverted
       style={{
         width: '80vw',
         height: 'auto',
         maxHeight: '70vh',
         left: '10%',
         padding: 0,
         overflowY: 'auto',
         position: 'fixed',
         top: '10vh',
         zIndex: 1000,
       }}
     >
       <Header as="h5" style={{display: 'flex', justifyContent: 'space-between',flexWrap: 'no-wrap', padding: '1vh'}}>Video position configuration


         {pictures && (stage.scene_type === 3  || stage.scene_type === 6 ) &&
           <Select
             inverted
             transparent
             placeholder='Picture'
             options={pictures}
             name="pictures"
             label='Pictures'
             type="select"
             onChange={(e, {value}) => switchPicture(e, value, 'picture_switch')}
             onBlur={e => handleBlur}
             defaultValue={pictures[pIndex].value}
             />
         }
         {(stage.scene_type === 2  || stage.scene_type === 3) &&
           <Select
             inverted
             transparent
             placeholder='Video position'
             options={positionOptions}
             name="videoPosition"
             label='Video Position'
             type="select"
             onChange={(e, {value}) => switchVideoPosition(e, value, 'video_position')}
             onBlur={e => handleBlur}
             defaultValue={videoPosition.mode}
             />
         }
         <Select
           inverted
           transparent
           placeholder='Ar Type'
           options={sceneOptions}
           name="arType"
           label='AR Type'
           style={{zIndex: 2003}}
           type="select"
           onChange={(e, {value}) => switchArType(e, value, 'scene_type')}
           onBlur={e => handleBlur}
           defaultValue={stage.scene_type}
           />
       </Header>
       {stage.scene_type > 0 &&
         <WallCanvas
           sceneType={stage.scene_type}
           dimension={stage.dimension}
           picturePosition={picturePosition}
           videoPosition={videoPosition}
           picture={(stage && stage.pictures && stage.pictures.length > 0) ? stage.pictures[pIndex] : null}
           video={(stage && stage.onPictureMatch && stage.onPictureMatch.length > 0) ? stage.onPictureMatch[0] : null}
           />
       }

       <Segment inverted style={{width:'45vw',display: 'flex', justifyContent: 'space-between',flexWrap: 'nowrap'}}>
         <div  style={{width:'25vw'}}>
           <Header inverted as="h6">Image Dimension in meters</Header>
             <Input
               fluid
               inverted
               transparent
               label='Width'
               placeholder='Width'
               type="text"
               name="width"
               onChange={e => handlePicturePosition(e.currentTarget.value, 'width')}
               onBlur={e => handleBlur}
               value={picturePosition.width}
               />
             <Slider color="grey" name="width" value={picturePosition.width} primary settings={pwidthSettings} />
               <Input
                 fluid
                 inverted
                 transparent
                 label='Height'
                 placeholder='Height'
                 type="text"
                 name="height"
                 onChange={e => handlePicturePosition(e.currentTarget.value, 'height')}
                 onBlur={e => handleBlur}
                 value={picturePosition.height}
                 />
               <Slider color="grey" name="height" value={picturePosition.height} primary settings={pheightSettings} />

          </div>
         <div style={{width:'25vw'}}>
           <Header inverted as="h6">Image Position</Header>
           {(stage.scene_type  === 5 || stage.scene_type  === 6) && <PivConfig picturePosition={picturePosition} handlePicturePosition={handlePicturePosition} leftSettings={leftSettings} rightSettings={rightSettings} handleBlur={handleBlur} topSettings={topSettings} bottomSettings={bottomSettings}/> }

         </div>
         <div style={{width:'25vw'}} >
           <Header inverted as="h6">Video Dimension in meters</Header>
             <Input
               fluid
               inverted
               transparent
               label='Width'
               placeholder='Width'
               type="text"
               name="width"
               onChange={e => handleVideoPosition(e.currentTarget.value, 'width')}
               onBlur={e => handleBlur}
               value={videoPosition.width}
               />
             <Slider color="grey" name="width" value={videoPosition.width} primary settings={widthSettings} />
               <Input
                 fluid
                 inverted
                 transparent
                 label='Height'
                 placeholder='Height'
                 type="text"
                 name="height"
                 onChange={e => handleVideoPosition(e.currentTarget.value, 'height')}
                 onBlur={e => handleBlur}
                 value={videoPosition.height}
                 />
               <Slider color="grey" name="height" value={videoPosition.height} primary settings={heightSettings} />
               </div>
             <div style={{width:'25vw'}} >
         <Header inverted as="h6">Video Position in meters</Header>
           {(videoPosition.mode === 'left' || videoPosition.mode === 'bottom' || videoPosition.mode === 'top') &&
             <>
             <Input
               fluid
               inverted
               transparent
               label='Left'
               placeholder='Left'
               type="text"
               name="left"
               onChange={e => handleVideoPosition(e.currentTarget.value, 'left')}
               onBlur={e => handleBlur}
               value={videoPosition.left}
               />
             <Slider color="grey" name="left" value={videoPosition.left} primary settings={leftSettings} />
             </>
           }
           {(videoPosition.mode === 'right' || videoPosition.mode === 'bottom' || videoPosition.mode === 'top') &&
             <>
             <Input
               fluid
               inverted
               transparent
               label='Right'
               placeholder='Right'
               type="text"
               name="right"
               onChange={e => handleVideoPosition(e.currentTarget.value, 'right')}
               onBlur={e => handleBlur}
               value={videoPosition.right}
               />
             <Slider color="grey" name="right" value={videoPosition.right} primary settings={rightSettings} />
             </>
           }
           {(videoPosition.mode === 'top' ) &&
             <>
             <Input
               fluid
               inverted
               transparent
               label='Top'
               placeholder='Top'
               type="text"
               name="top"
               onChange={e => handleVideoPosition(e.currentTarget.value, 'top')}
               onBlur={e => handleBlur}
               value={videoPosition.top}
               />
             <Slider color="grey" name="top" value={videoPosition.top} primary settings={topSettings} />
             </>
           }
            {(videoPosition.mode === 'left' || videoPosition.mode === 'right' || videoPosition.mode === 'bottom') &&
              <>
               <Input
                 fluid
                 inverted
                 transparent
                 label='Bottom'
                 placeholder='Bottom'
                 type="text"
                 name="bottom"
                 onChange={e => handleVideoPosition(e.currentTarget.value, 'bottom')}
                 onBlur={e => handleBlur}
                 value={videoPosition.bottom}
                 />
               <Slider color="grey" name="bottom" value={videoPosition.bottom} primary settings={bottomSettings} />
             </>
        }
       </div>
       </Segment>
         <Segment inverted  style={{display: 'flex', justifyContent: 'space-between',flexWrap: 'no-wrap'}}>
           <Button secondary onClick={e=> toggleArType()}>close</Button>
           <Button primary onClick={e=> saveVideoposition()}>Save</Button>
         </Segment>
   </Segment>

   </>
   </TransitionablePortal>
  );

}

class StageEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {

    }
  }
  render() {
    let { animation, duration, open , stage, videoPosition, picturePosition, leftSettings, rightSettings, topSettings, bottomSettings, pIndex, widthSettings, heightSettings, pwidthSettings, pheightSettings} = this.props;

    return (
      <VideoConfig
        stage={stage}
        videoPosition={videoPosition}
        picturePosition={picturePosition}
        animation={animation}
        duration={duration}
        open={open}
        pIndex={pIndex}
        widthSettings={widthSettings}
        pwidthSettings={pwidthSettings}
        heightSettings={heightSettings}
        pheightSettings={pheightSettings}
        switchArType={this.props.switchArType}
        switchPicture={this.props.switchPicture}
        saveVideoposition={this.props.saveVideoposition}
        toggleArType={this.props.toggleArType}
        handlePicturePosition={this.props.handlePicturePosition}
        handleVideoPosition={this.props.handleVideoPosition}
        switchVideoPosition={this.props.switchVideoPosition}
        handleBlur={this.props.handleBlur}
        leftSettings={leftSettings}
        rightSettings={rightSettings}
        topSettings={topSettings}
        bottomSettings={bottomSettings}
        />
    )
  }
}

export default StageEditor;
