import React from "react";
import clsx from "clsx";
import {makeStyles} from '@material-ui/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';


const useStyles = makeStyles((theme) => ({
root: {
  // with: '100vw',
  // height: '100vh',
  margin: 0,
  height: '100vh',
  color: '#FFF',
  flexGrow: 1,
  maxWidth: 400,
  padding: 0,
  overflow: 'hidden',
  background: '#041830',
},
list: {
  width: '40vw',
  background: '#041830',
  height: '100vh',
},
fullList: {
  width: 'auto',
},
}));
const Options = ({toggleDrawer}) => {
  const classes= useStyles();
  const anchor = "left";
  return (
    <ClickAwayListener onClickAway={() => toggleDrawer("right", false)}>
    <div
      className={clsx(classes.list, {
        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
      })}
      role="presentation"
      //onClick={toggleDrawer(anchor, false)}
      onKeyDown={toggleDrawer(anchor, false)}
    >
      toto
    </div>
  </ClickAwayListener>
  )
}
export default Options;
