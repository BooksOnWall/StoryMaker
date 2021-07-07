import React  from 'react';

import loadable from '@loadable/component';
import {makeStyles} from '@material-ui/styles';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';


const Timeline = loadable(() => import('./Timeline'));
const Layers = loadable(() => import('./Layers'));


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

const Drawers = ({state, toggleDrawer}) => {
  const classes = useStyles();
  return (
    <>
      {/** left drawer **/}
      <React.Fragment key={"left"}>
        <SwipeableDrawer
          anchor={"left"}
          variant="persistent"
          open={state.left}
          onClose={toggleDrawer("left", false)}
          onOpen={toggleDrawer("left", true)}
        >
          <Layers toggleDrawer={toggleDrawer}/>
        </SwipeableDrawer>
      </React.Fragment>
      {/** right drawer **/}
      <React.Fragment key={"right"}>
        <SwipeableDrawer
          anchor={"right"}
          open={state.right}
          onClose={toggleDrawer("right", false)}
          onOpen={toggleDrawer("right", true)}
        >
          <div>toto</div>
        </SwipeableDrawer>
      </React.Fragment>
      {/** bottom drawer **/}
      <React.Fragment key={"bottom"}>
        <SwipeableDrawer
          anchor={"bottom"}
          open={state.bottom}
          onClose={toggleDrawer("bottom", false)}
          onOpen={toggleDrawer("bottom", true)}
        >
          <Timeline toggleDrawer={toggleDrawer} />
        </SwipeableDrawer>
      </React.Fragment>
    </>
  )
}
export default Drawers
