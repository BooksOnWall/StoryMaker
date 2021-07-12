import React, { Suspense, useState } from 'react';
import { Canvas, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import MovieIcon from '@material-ui/icons/Movie';
import HelpIcon from '@material-ui/icons/Help';
import loadable from '@loadable/component';
import {
  Box
} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import { defineMessages, injectIntl } from 'react-intl';

extend({ OrbitControls });

const Fab = loadable(() => import('../template/Fab'));
const Drawers = loadable(() => import('./Drawers'));
const Login = loadable(() => import('../api/user/Login'));
const LanguageSwitch = loadable(() => import('../api/user/LanguageSwitch'));


const editorTraductions = defineMessages({
  new: {
    id: 'menu.new',
    defaultMessage: 'New',
  },
  layers: {
    id: 'menu.layers',
    defaultMessage: 'Layers',
  },
  options: {
    id: 'menu.options',
    defaultMessage: 'Options',
  },
  timeline: {
    id: 'menu.timeline',
    defaultMessage: 'Timeline',
  },
  configure: {
    id: 'menu.configure',
    defaultMessage: 'Configure',
  },
  translate: {
    id: 'menu.translate',
    defaultMessage: 'Translate',
  },
  save: {
    id: 'menu.save',
    defaultMessage: 'Save',
  },
  duplicate: {
    id: 'menu.duplicate',
    defaultMessage: 'Duplicate',
  },
  publish: {
    id: 'menu.publish',
    defaultMessage: 'Publish',
  },
  share: {
    id: 'menu.share',
    defaultMessage: 'Share',
  },
});

const useStyles = makeStyles((theme) => ({
root: {
  with: '100vw',
  height: '100vh',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  background: '#041830',
},
left: {
  position: 'absolute',
  zIndex: 1007,
  color: '#FFF',
  transform: 'rotate(90deg)',
  fontSize: 8,
},
right: {
  position: 'absolute',
  transform: 'rotate(-90deg)',
  zIndex: 1007,
  right: 0,
  color: '#FFF',
  fontSize: 8,
},
bottom: {
  position: 'absolute',
  zIndex: 1007,
  bottom: 0,
  color: '#FFF',
  fontSize: 12,
},
logo:{
  top: 30,
  fontSize: 12,
  maxHeight: 60,
},
drawer: {
  backgroundColor: 'transparent',
  zIndex: 1008,
  display: 'flex',
  position: 'absolute',
  top: 0,
  left: 0,
  justifyContent: 'space-between'
},

}));
const Plane = () => (
  <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.5, 0]} receiveShadow>
    <planeBufferGeometry attach="geometry" args={[20, 20]} />
    <meshBasicMaterial attach="material" color="#082444" />
  </mesh>
);
const Controls = () => {
  const { camera, gl } = useThree();
  return (
    <OrbitControls
      enableZoom={false}
      maxPolarAngle={Math.PI / 3}
      minPolarAngle={Math.PI / 3}
      args={[camera, gl.domElement]}
     />
  )
}
const Editor = ({messages, history, locale, switchLang, allMessages}) => {

  const classes = useStyles();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });
  console.log('editor', switchLang);
  const toggleDrawer = (anchor, open) => (event) => {
    console.log('anchor', anchor);
    console.log('open', open);
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };
  document.addEventListener("keydown", function(e) {
    // https://keycode.info/
    // ctrl + t
    console.log(e.keyCode);
    if (e.keyCode === 84 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      console.log('press ctrl + t')
      // Process event...
    }
    // ctrl + n
    if (e.keyCode === 17 && (navigator.platform.match("Mac") ? e.metaKey : e.ctrlKey)) {
      e.preventDefault();
      console.log('press ctrl + s')
      // Process event...
    }
  }, false);
  return (
    <>
    <Box style={{display: 'block', top: 0, left: 0, width: 0, height: 0, position: 'abolute', zIndex: '1000', backgroundColor: 'transparent'}}>
      <Login messages={messages} history={history}/>
      <LanguageSwitch  switchLang={switchLang} history={history} allMessages={allMessages} messages={messages} locale={locale} className={classes.lenguageSwitch} />
      <IconButton onClick={toggleDrawer('bottom', true)} className={classes.bottom} style={{fontSize: 9, color: '#FFF', position: 'absolute', bottom: 0}}><MovieIcon fontSize="large" color="primary"/><ArrowDownwardIcon fontSize="large" color="primary"/>{messages.menu.timeline}</IconButton>
      <IconButton onClick={toggleDrawer('left', true)} className={classes.left} style={{zIndex: 1007, fontSize: 12, color: '#FFF',position: 'absolute', top: 0, left: 0,paddingTop: 50 }}><MenuOpenIcon fontSize="small" color="primary"/>{messages.menu.layers}</IconButton>
      <IconButton onClick={toggleDrawer('right', true)} className={classes.right} style={{fontSize: 12, color: '#FFF',position: 'absolute', right: 0 ,paddingTop: 50}}><MenuOpenIcon fontSize="small" color="primary"/>{messages.menu.options}</IconButton>
      <IconButton  className={classes.help} style={{fontSize: 12, color: '#FFF',position: 'absolute', right: '4vw'}}><HelpIcon fontSize="large" color="primary"/></IconButton>
    </Box>
      <Box className={classes.root}>
        <Fab toggleDrawer={toggleDrawer} messages={messages}/>
        <Drawers state={state} toggleDrawer={toggleDrawer}/>
        <Canvas shadowMap  camera={{ position: [2, 2, 2] }}>
          <Controls />
          <Plane />
          <gridHelper />
        </Canvas>
      </Box>
    </>
  )
}
export default injectIntl(Editor);
