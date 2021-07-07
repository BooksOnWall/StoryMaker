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

const Fab = loadable(() => import('../template/menu'));
const Drawers = loadable(() => import('./Drawers'));

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
  fontSize: 12,
},
right: {
  position: 'absolute',
  zIndex: 1007,
  right: 0,
  color: '#FFF',
  fontSize: 12,
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
  maxHeight: 90,
  position: 'fixed',
  zIndex: 999999,
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
const Editor = () => {
  const classes = useStyles();
  const [state, setState] = useState({
    top: false,
    left: false,
    bottom: false,
    right: false,
  });

  const toggleDrawer = (anchor, open) => (event) => {
    if (event && event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setState({ ...state, [anchor]: open });
  };


  return (
    <>
      <IconButton onClick={toggleDrawer('bottom', true)} className={classes.bottom} style={{position: 'absolute', bottom: 0}}><MovieIcon fontSize="large" color="primary"/><ArrowDownwardIcon fontSize="large" color="primary"/>{"Timeline"}</IconButton>
      <IconButton onClick={toggleDrawer('left', true)} className={classes.left} style={{position: 'absolute', left: 0}}><MenuOpenIcon fontSize="large" color="primary"/>{"left"}</IconButton>
      <IconButton onClick={toggleDrawer('right', true)} className={classes.right} style={{position: 'absolute', right: 0}}><MenuOpenIcon fontSize="large" color="primary"/>{"right"}</IconButton>
      <Box className={classes.root}>
        <Fab />
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
