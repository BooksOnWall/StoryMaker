import React, { Suspense } from 'react';
import { Canvas, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';

import loadable from '@loadable/component';
import {
  Box,
    makeStyles
} from '@material-ui/core';
extend({ OrbitControls });
const useStyles = makeStyles((theme) => ({
root: {
  with: '100vw',
  height: '100vh',
  margin: 0,
  padding: 0,
  overflow: 'hidden',
  background: '#041830',
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
const HomePage = () => {
  const classes = useStyles();
  return (
    <Box className={classes.root}>
    <Canvas shadowMap  camera={{ position: [2, 2, 2] }}>
      <Controls />
      <Plane />
      <gridHelper />
    </Canvas>
    </Box>
  )
}
export default HomePage;
