import React, { Component, createRef, useRef  } from 'react';
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
import Editor3d from './Editor3d/Editor3d';

import Wall from '../../../../assets/images/wall.jpg';

const sceneOptions = [
  { key: 1, value: 1, text: 'Video inside Picture' },
  { key: 2, value: 2, text: 'Video aside anchored picture' },
  { key: 3, value: 3, text: 'Video aside anchored with multiple pictures' },
  { key: 4, value: 4, text: 'Portal' },
  { key: 5, value: 5, text: 'Picture inside Video' },
  { key: 6, value: 6, text: 'Pictures inside Video' },
  { key: 7, value: 7, text: '3D Scene' }
];
const PIV = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePositions, sceneType, meters2pixels, alignItems}) => {
  // video fill the whole screen and image is centered , positions apply from this state
  let pictureRatio = {
      width: (100 - ((videoPosition.width - picturePosition.width) / videoPosition.width)*100)+'%',
      height: (100 - ((videoPosition.height - picturePosition.height) / videoPosition.height)*100)+'%',
  };
  const percentUnit = (value,direction) => {
    let percent ='';
    if (direction === 'left' || direction === 'right') {
      percent = (((videoPosition.width - value)/videoPosition.width)*100);
    }
    if (direction === 'top' || direction === 'bottom') {
      percent = (((videoPosition.height - value)/videoPosition.height)*100);
    }
    if (direction === 'width') {
      percent = (((videoPosition.width - value)/videoPosition.width)*100);
    }
    if (direction === 'height') {
      percent = (((videoPosition.height - value)/videoPosition.height)*100);
    }
    return percent;
  };
  const pstyle = {
      position: 'absolute',
      opacity: .75,
      alignSelf: alignItems,
      width: pictureRatio.width,
      height: pictureRatio.height,
      maxHeight: '45vh'
    };
  if(picturePosition.left > 0) {
    pstyle.left = percentUnit(picturePosition.left, 'left');
  }
  if(picturePosition.right > 0) {
    pstyle.right = percentUnit(picturePosition.right, 'right');
  }
  if (picturePosition.top > 0) {
    pstyle.top = percentUnit(picturePosition.top, 'top') ;
  }
  if (picturePosition.bottom > 0) {
    pstyle.bottom = percentUnit(picturePosition.bottom, 'bottom') ;
  }

  return (<>

    {video &&
      <div id="videoRefPIV" style={{zIndex: 999, maxWidth: '45vh', maxHeight: '45vh'}}>
        {dimension && picture && (videoPosition.mode === "left" || videoPosition.mode === "top")  &&
          <div style={{position: 'absolute', width: percentUnit(picturePosition.width, 'width')+'%', height: percentUnit(picturePosition.height, 'height')+'%', alignSelf: alignItems, display: 'flex', flexDirection: 'column', justifyContent: 'center',  maxWidth: '45vh'}}>
            <Image style={pstyle} src={picture.src} />
          </div>
        }
        <video  src={video.src} width={pictureRatio.width} height={pictureRatio.height}  style={{maxHeight: '45vh'}}/>
    </div>
    }
    </>);
}
const VIP = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePositions, sceneType, meters2pixels, alignItems}) => {
  const ratioIze = (value, width, height) => {
    let ratio = (height/width);
    value = value.split("vh")[0];
    return (value * ratio)+'vh';
  }

  return (
    <>
      <Image src={picture.src} style={{position: 'absolute', maxHeight: '45vh', minHeight: '45vh', minWidth : ratioIze('45vh', picturePosition.width, picturePosition.height ), zIndex: 998, width: meters2pixels(picturePosition.width), height: meters2pixels(picturePosition.height) }}/>
      <div style={{ maxHeight: '45vh', zIndex: 999, width: ratioIze('45vh', picturePosition.width, picturePosition.height ), height: '45vh' }}>
          <video src={video.src} width={meters2pixels(picturePosition.width)} height={meters2pixels(picturePosition.height)}  />

      </div>
      </>
  );
}
const PAV = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePositions, sceneType, meters2pixels, alignItems}) => {
  return (<>
    {dimension && picture && (videoPosition.mode === "left" || videoPosition.mode === "top")  &&
      <div style={{zIndex: 1001, width: meters2pixels(picturePosition.width), height: meters2pixels(picturePosition.height), alignSelf: alignItems, marginTop: picturePosition.bottom, marginBottom: picturePosition.top}}>
        <Image style={{width: meters2pixels(picturePosition.width), height: meters2pixels(picturePosition.height)}} src={picture.src}/>

      </div>
    }
    {video &&
      <div style={{zIndex: 1002, width: meters2pixels(videoPosition.width), height: meters2pixels(videoPosition.height),  marginLeft: meters2pixels(videoPosition.left), marginTop: meters2pixels(videoPosition.bottom), marginRight: meters2pixels(videoPosition.right), marginBottom: meters2pixels(videoPosition.top)}} className="draggable">

        <video src={video.src} width={meters2pixels(picturePosition.width)} height={meters2pixels(picturePosition.height)}  />
      </div>

    }
    {dimension && picture && (videoPosition.mode === "right" || videoPosition.mode === "bottom" ) &&
      <div style={{zIndex: 1001, width: meters2pixels(picturePosition.width),height: meters2pixels(picturePosition.height), alignSelf: alignItems, marginTop: picturePosition.bottom, marginBottom: picturePosition.top}} className="draggable">

        <Image style={{width: meters2pixels(picturePosition.width),height: meters2pixels(picturePosition.height)}} src={picture.src} />
      </div>
    }
  </>)
}
const WallCanvas = ({dimension, picture, video, videoPosition, picturePosition, handlePositionChange, savePositions, sceneType}) =>  {
  const meters2pixels = (meters) => (meters*40);
  let display = (videoPosition.mode === 'left' || videoPosition.mode === 'right') ? 'flex' : 'flex';
  let alignItems = (videoPosition.mode === 'left' || videoPosition.mode === 'right') ? 'center' : 'center';
  let justifyContent = (videoPosition.mode === 'left' || videoPosition.mode === 'right') ? 'center' : 'center';
  justifyContent = (sceneType === 7) ? 'center' : justifyContent;
  alignItems = (sceneType === 7) ? 'stretch' : alignItems;
  return (
    <Segment style={{height: '45vh',justifyContent: justifyContent, alignItems: alignItems, minHeight: '45vh', display: display, flexWrap: 'wrap', padding: 0, backgroundImage: `url(${Wall})`}}>
      {(sceneType === 1) && <VIP meters2pixels={meters2pixels} alignItems={alignItems} dimension={dimension} picture={picture} video={video} videoPosition={videoPosition} picturePosition={picturePosition} handlePositionChange={handlePositionChange} savePositions={savePositions} sceneType={sceneType}/>}
      {(sceneType === 2  || sceneType === 3) && <PAV meters2pixels={meters2pixels} alignItems={alignItems} dimension={dimension} picture={picture} video={video} videoPosition={videoPosition} picturePosition={picturePosition} handlePositionChange={handlePositionChange} savePositions={savePositions} sceneType={sceneType}/>}
      {(sceneType === 5 || sceneType === 6) && <PIV meters2pixels={meters2pixels} alignItems={alignItems} dimension={dimension} picture={picture} video={video} videoPosition={videoPosition} picturePosition={picturePosition} handlePositionChange={handlePositionChange} savePosition={savePositions} sceneType={sceneType}/>}
      {(sceneType === 4) && <Image src={Portal} style={{maxWidth: '70vw', maxHeight: '30vh'}}/>}
      {(sceneType === 7) && <Editor3d  />}
    </Segment>
  );
};

const VideoSize = ({ conf, handleVideoPosition, handleBlur, widthSettings, heightSettings  }) => {
  return (
    <>
    <Input
        fluid
        inverted
        transparent
        label='Width'
        placeholder='Width'
        type="text"
        name="vwidth"
        onChange={e => handleVideoPosition(e.currentTarget.value, 'width')}
        onBlur={e => handleBlur}
        value={conf.width}
        />
      <Slider color="grey" name="vwidth" value={conf.width} primary settings={widthSettings} />
        <Input
          fluid
          inverted
          transparent
          label='Height'
          placeholder='Height'
          type="text"
          name="vheight"
          onChange={e => handleVideoPosition(e.currentTarget.value, 'height')}
          onBlur={e => handleBlur}
          value={conf.height}
          />
        <Slider color="grey" name="vheight" value={conf.height} primary settings={heightSettings} />
        </>
    );
}
const PictureSize = ({picturePosition, handlePicturePosition, handleBlur, pwidthSettings, pheightSettings}) => {
  return (
    <>
    <Header inverted as="h6">Image Dimension in meters</Header>
    <Input
       fluid
       inverted
       transparent
       label='Width'
       placeholder='Width'
       type="text"
       name="pwidth"
       onChange={e => handlePicturePosition(e.currentTarget.value, 'width')}
       onBlur={e => handleBlur}
       value={picturePosition.width}
       />
     <Slider color="grey" name="pwidth" value={picturePosition.width} primary settings={pwidthSettings} />
       <Input
         fluid
         inverted
         transparent
         label='Height'
         placeholder='Height'
         type="text"
         name="pheight"
         onChange={e => handlePicturePosition(e.currentTarget.value, 'height')}
         onBlur={e => handleBlur}
         value={picturePosition.height}
         />
       <Slider color="grey" name="pheight" value={picturePosition.height} primary settings={pheightSettings} />
       </>
  );
}
const PicturePosition = ({picturePosition, handlePicturePosition, pleftSettings, prightSettings, handleBlur, ptopSettings, pbottomSettings, xpictureSettings, ypictureSettings, zpictureSettings }) => {
  return (
    <>
    <Header inverted as="h6">Image Position</Header>
    <div style={{width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'stretch'}}>
    <div style={{width: '50%'}}>
      <Input
        fluid
        inverted
        transparent
        label='X'
        placeholder='X'
        type="text"
        name="px"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'x')}
        onBlur={e => handleBlur}
        value={picturePosition.x}
        />
      <Slider color="grey" name="px" value={picturePosition.x} primary settings={xpictureSettings} />

      <Input
        fluid
        inverted
        transparent
        label='Y'
        placeholder='Y'
        type="text"
        name="py"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'y')}
        onBlur={e => handleBlur}
        value={picturePosition.y}
        />
      <Slider color="grey" name="py" value={picturePosition.y} primary settings={ypictureSettings} />

      <Input
        fluid
        inverted
        transparent
        label='Z'
        placeholder='Z'
        type="text"
        name="pz"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'z')}
        onBlur={e => handleBlur}
        value={picturePosition.z}
        />
      <Slider color="grey" name="pz" value={picturePosition.z} primary settings={zpictureSettings} />
      </div>
      <div  style={{width: '50%'}}>

      <Input
        fluid
        inverted
        transparent
        label='Right'
        placeholder='Right'
        type="text"
        name="pright"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'right')}
        onBlur={e => handleBlur}
        value={picturePosition.right}
        />
      <Slider color="grey" name="pright" value={picturePosition.right} primary settings={prightSettings} />
        <Input
          fluid
          inverted
          transparent
          label='Left'
          placeholder='Left'
          type="text"
          name="pleft"
          onChange={e => handlePicturePosition(e.currentTarget.value, 'left')}
          onBlur={e => handleBlur}
          value={picturePosition.left}
          />
        <Slider color="grey" name="pleft" value={picturePosition.left} primary settings={pleftSettings} />

      <Input
        fluid
        inverted
        transparent
        label='Up'
        placeholder='Up'
        type="text"
        name="ptop"
        onChange={e => handlePicturePosition(e.currentTarget.value, 'top')}
        onBlur={e => handleBlur}
        value={picturePosition.top}
        />
      <Slider color="grey" name="ptop" value={picturePosition.top} primary settings={ptopSettings} />

    <Input
          fluid
          inverted
          transparent
          label='Down'
          placeholder='Down'
          type="text"
          name="pbottom"
          onChange={e => handlePicturePosition(e.currentTarget.value, 'bottom')}
          onBlur={e => handleBlur}
          value={picturePosition.bottom}
          />
        <Slider color="grey" name="pbottom" value={picturePosition.bottom} primary settings={pbottomSettings} />

  </div>
      </div>
  </>
  );
}
const VideoPosition = ({videoPosition,handleVideoPosition,handleBlur, leftSettings, rightSettings, topSettings, bottomSettings,xSettings, ySettings, zSettings}) => {
  return (
    <>
    <div>
      <Header inverted as="h6">Video Position in meters</Header>
    <Input
      fluid
      inverted
      transparent
      label='X'
      placeholder='X'
      type="text"
      name="vx"
      onChange={e => handleVideoPosition(e.currentTarget.value, 'x')}
      onBlur={e => handleBlur}
      value={videoPosition.x}
      />
    <Slider color="grey" name="vx" value={videoPosition.x} primary settings={xSettings} />


    <Input
      fluid
      inverted
      transparent
      label='Y'
      placeholder='Y'
      type="text"
      name="vy"
      onChange={e => handleVideoPosition(e.currentTarget.value, 'y')}
      onBlur={e => handleBlur}
      value={videoPosition.y}
      />
    <Slider color="grey" name="vy" value={videoPosition.y} primary settings={ySettings} />


    <Input
      fluid
      inverted
      transparent
      label='Z'
      placeholder='Z'
      type="text"
      name="vz"
      onChange={e => handleVideoPosition(e.currentTarget.value, 'z')}
      onBlur={e => handleBlur}
      value={videoPosition.z}
      />
    <Slider color="grey" name="vz" value={videoPosition.z} primary settings={zSettings} />
    </div>
    <div>
        <Input
          fluid
          inverted
          transparent
          label='Right'
          placeholder='Right'
          type="text"
          name="vright"
          onChange={e => handleVideoPosition(e.currentTarget.value, 'right')}
          onBlur={e => handleBlur}
          value={videoPosition.right}
          />
        <Slider color="grey" name="vright" value={videoPosition.right} primary settings={rightSettings} />
          <Input
            fluid
            inverted
            transparent
            label='Left'
            placeholder='Left'
            type="text"
            name="vleft"
            onChange={e => handleVideoPosition(e.currentTarget.value, 'left')}
            onBlur={e => handleBlur}
            value={videoPosition.left}
            />
          <Slider color="grey" name="vleft" value={videoPosition.left} primary settings={leftSettings} />

        <Input
          fluid
          inverted
          transparent
          label='Up'
          placeholder='Up'
          type="text"
          name="vtop"
          onChange={e => handleVideoPosition(e.currentTarget.value, 'top')}
          onBlur={e => handleBlur}
          value={videoPosition.top}
          />
        <Slider color="grey" name="vtop" value={videoPosition.top} primary settings={topSettings} />

          <Input
            fluid
            inverted
            transparent
            label='Down'
            placeholder='Down'
            type="text"
            name="vbottom"
            onChange={e => handleVideoPosition(e.currentTarget.value, 'bottom')}
            onBlur={e => handleBlur}
            value={videoPosition.bottom}
            />
          <Slider color="grey" name="vbottom" value={videoPosition.bottom} primary settings={bottomSettings} />

     </div>
   </>
  );
}
const VideoConfig = ({stage, videoPosition, picturePosition, animation, duration, open, handleBlur, leftSettings, rightSettings, topSettings, bottomSettings, pleftSettings, prightSettings, ptopSettings, pbottomSettings, handleVideoPosition, handlePicturePosition, switchVideoPosition, switchPicture, toggleArType, switchArType, savePositions, pIndex, widthSettings, heightSettings, pwidthSettings, pheightSettings, xSettings, ySettings, zSettings, xpictureSettings, ypictureSettings, zpictureSettings}) => {
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
  
  return (
    <TransitionablePortal
     open={open}
     transition={{ animation, duration }}
   >
    <>
     <Segment
       inverted
       id="videoConfig"
       style={{
         width: '90vw',
         height: '85vh',
         maxHeight: '90vh',
         left: '5vw',
         padding: 0,
         overflowY: 'auto',
         position: 'fixed',
         top: '5vh',
         zIndex: 1000,
       }}
     >
       <Header as="h5" style={{display: 'flex', justifyContent: 'space-between',flexWrap: 'no-wrap', padding: '1vh', paddingBottom: 0}}>Stage configuration editor


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

       <Segment inverted style={{width:'100%',display: 'flex', justifyContent: 'space-around',flexWrap: 'wrap'}}>
         <div  style={{width:'25%'}}>
            <PictureSize
              picturePosition={picturePosition}
              handlePicturePosition={handlePicturePosition}
              handleBlur={handleBlur}
              pwidthSettings={pwidthSettings}
              pheightSettings={pheightSettings}
               />
          </div>

           {(stage.scene_type  === 5 || stage.scene_type  === 6 || stage.scene_type  === 7 ) &&
             <div style={{width:'25%'}}>
               <PicturePosition
                 picturePosition={picturePosition}
                 handlePicturePosition={handlePicturePosition}
                 handleBlur={handleBlur}
                 pleftSettings={pleftSettings}
                 prightSettings={prightSettings}
                 ptopSettings={ptopSettings}
                 pbottomSettings={pbottomSettings}
                 xpictureSettings={xpictureSettings}
                 ypictureSettings={ypictureSettings}
                 zpictureSettings={zpictureSettings}
              />
            </div>
           }


         <div style={{width:'25%'}} >
           <Header inverted as="h6">Video Dimension in meters</Header>
           <VideoSize
             conf={videoPosition}
             handleBlur={handleBlur}
             widthSettings={widthSettings}
             heightSettings={heightSettings}
             handleVideoPosition={handleVideoPosition}
             />

        </div>
        {(stage.scene_type  === 2 || stage.scene_type  === 3 || stage.scene_type  === 7  ) &&
          <div style={{width: '50%', display: 'flex', justifyContent: 'space-around', alignItems: 'stretch'}} >
            <VideoPosition
              videoPosition={videoPosition}
              handleVideoPosition={handleVideoPosition}
              handleBlur={handleBlur}
              leftSettings={leftSettings}
              rightSettings={rightSettings}
              topSettings={topSettings}
              bottomSettings={bottomSettings}
              xSettings={xSettings}
              ySettings={ySettings}
              zSettings={zSettings}
            />
         </div>
      }
       </Segment>
         <Segment inverted  style={{display: 'flex', justifyContent: 'space-between',flexWrap: 'no-wrap'}}>
           <Button secondary onClick={e=> toggleArType()}>close</Button>
           <Button primary onClick={(e) => savePositions()}>Save</Button>
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
    let { animation, duration, open , stage, videoPosition, picturePosition, leftSettings, rightSettings, topSettings, bottomSettings,pleftSettings, prightSettings, ptopSettings, pbottomSettings, pIndex, widthSettings, heightSettings, pwidthSettings, pheightSettings, xSettings, ySettings, zSettings, xpictureSettings, ypictureSettings, zpictureSettings} = this.props;

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
        xSettings={xSettings}
        ySettings={ySettings}
        zSettings={zSettings}
        xpictureSettings={xpictureSettings}
        ypictureSettings={ypictureSettings}
        zpictureSettings={zpictureSettings}
        switchArType={this.props.switchArType}
        switchPicture={this.props.switchPicture}
        savePositions={this.props.savePositions}
        toggleArType={this.props.toggleArType}
        handlePicturePosition={this.props.handlePicturePosition}
        handleVideoPosition={this.props.handleVideoPosition}
        switchVideoPosition={this.props.switchVideoPosition}
        handleBlur={this.props.handleBlur}
        leftSettings={leftSettings}
        rightSettings={rightSettings}
        topSettings={topSettings}
        bottomSettings={bottomSettings}
        pleftSettings={pleftSettings}
        prightSettings={prightSettings}
        ptopSettings={ptopSettings}
        pbottomSettings={pbottomSettings}
        />
    )
  }
}

export default StageEditor;
