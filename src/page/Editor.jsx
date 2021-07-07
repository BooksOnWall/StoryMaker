import React, { Suspense, useState } from 'react';
import { Canvas, extend, useThree } from '@react-three/fiber';
import { OrbitControls, Environment } from '@react-three/drei';
import clsx from "clsx";
import IconButton from '@material-ui/core/IconButton';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import ArrowDownwardIcon from '@material-ui/icons/ArrowDownward';
import MenuOpenIcon from '@material-ui/icons/MenuOpen';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import InboxIcon from '@material-ui/icons/MoveToInbox';
import MailIcon from '@material-ui/icons/Mail';

import loadable from '@loadable/component';
import {
  Box,
    makeStyles
} from '@material-ui/core';
extend({ OrbitControls });

const Fab = loadable(() => import('../template/menu'));

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
  color: '#FFF'
},
right: {
  position: 'absolute',
  zIndex: 1007,
  right: 0,
  color: '#FFF'
},
bottom: {
  position: 'absolute',
  zIndex: 1007,
  bottom: 0,
  color: '#FFF'
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
list: {
  width: 250,
},
fullList: {
  width: 'auto',
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

  const list = (anchor) => (
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      <List>
        {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {['All mail', 'Trash', 'Spam'].map((text, index) => (
          <ListItem button key={text}>
            <ListItemIcon>{index % 2 === 0 ? <InboxIcon /> : <MailIcon />}</ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );
  return (
    <>
      <IconButton onClick={toggleDrawer('bottom', true)} className={classes.bottom}><ArrowDownwardIcon fontSize="small" color="primary"/>{"bottom"}</IconButton>
      <IconButton onClick={toggleDrawer('left', true)} className={classes.left}><MenuOpenIcon fontSize="small" color="primary"/>{"left"}</IconButton>
      <IconButton onClick={toggleDrawer('right', true)} className={classes.right}><MenuOpenIcon fontSize="small" color="primary"/>{"right"}</IconButton>
      <Box className={classes.root}>
        <Fab />
       {['left', 'right', 'bottom'].map((anchor) => (
         <React.Fragment key={anchor}>
           <SwipeableDrawer
             anchor={anchor}
             open={state[anchor]}
             onClose={toggleDrawer(anchor, false)}
             onOpen={toggleDrawer(anchor, true)}
           >
             {list(anchor)}
           </SwipeableDrawer>
         </React.Fragment>
       ))}
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
