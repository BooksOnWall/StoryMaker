import React, { Suspense, useState } from 'react';
import { Canvas, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import IconButton from '@material-ui/core/IconButton';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import MovieIcon from '@material-ui/icons/Movie';
import loadable from '@loadable/component';
import {
  Box
} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
extend({ OrbitControls });

const Fab = loadable(() => import('../template/Fab'));
const Drawers = loadable(() => import('./Drawers'));
const Login = loadable(() => import('../api/user/Login'));
const LanguageSwitch = loadable(() => import('../api/user/LanguageSwitch'))
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
  fontSize: 8,
},
right: {
  position: 'absolute',
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

  return (
    <>
    <Box style={{display: 'block', top: 0, left: 0, width: 0, height: 0, position: 'abolute', zIndex: '1000', backgroundColor: 'transparent'}}>
      <Login messages={messages} history={history}/>
      <LanguageSwitch  switchLang={switchLang} history={history} allMessages={allMessages} messages={messages} locale={locale} className={classes.lenguageSwitch} />
      <IconButton onClick={toggleDrawer('bottom', true)} className={classes.bottom} style={{fontSize: 9, color: '#FFF', position: 'absolute', bottom: 0}}><MovieIcon fontSize="large" color="primary"/><ArrowDownwardIcon fontSize="large" color="primary"/>{"Timeline"}</IconButton>
      <IconButton onClick={toggleDrawer('left', true)} className={classes.left} style={{zIndex: 1007, fontSize: 12, color: '#FFF',position: 'absolute', left: 0}}><MenuOpenIcon fontSize="small" color="primary"/>{"Layers"}</IconButton>
      <IconButton onClick={toggleDrawer('right', true)} className={classes.right} style={{fontSize: 12, color: '#FFF',position: 'absolute', right: 0}}><MenuOpenIcon fontSize="small" color="primary"/>{"Options"}</IconButton>
    </Box>
      <Box className={classes.root}>
        <Fab toggleDrawer={toggleDrawer}/>
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
export default Editor;
