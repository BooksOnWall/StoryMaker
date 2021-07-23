import React , {useState} from 'react';
import {makeStyles} from '@material-ui/styles';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/core/SpeedDial';
import SpeedDialAction from '@material-ui/core/SpeedDialAction';
import CreateNewFolderIcon from '@material-ui/icons/CreateNewFolder';
import PublishIcon from '@material-ui/icons/Publish';
import TuneIcon from '@material-ui/icons/Tune';
import MovieIcon from '@material-ui/icons/Movie';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import ShareIcon from '@material-ui/icons/Share';
import TranslateIcon from '@material-ui/icons/Translate';
import LayersIcon from '@material-ui/icons/Layers';
import PermDataSettingIcon from '@material-ui/icons/PermDataSetting';

import logo from '../assets/images/logo.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: '50vw',
    margin: 0,
    padding: 0,
    maxHeight: 308,
    zIndex: 1006,
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  logoIcon:{
    padding: 0,
    margin: 0,
    fontSize: 8,
    height: 10,
    width: 10,
    background: '#fff',
    padding: 1
  },
  speedDial: {
    position: 'absolute',
    width: 12,
    margin:0,
    padding: 0,
    fontSize: 8,
    size: "small",
    zIndex: 1007,
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
      margin: 0,
      padding: 0,
    },


  },
}));


  const Fab = ({toggleDrawer, messages}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const actions = [
    { icon: <CreateNewFolderIcon color="secondary"/>, name: messages.menu.new },
    { icon: <LayersIcon color="secondary"/>, name: messages.menu.layers, drawer: 'left', open: 'true'},
    { icon: <MovieIcon color="secondary"/>, name: messages.menu.timeline, drawer: 'bottom', open: 'true'},
    { icon: <PermDataSettingIcon color="secondary"/>, name: messages.menu.options, drawer: 'right', open: 'true'},
    { icon: <TuneIcon color="secondary"/>, name: messages.menu.configure },
    { icon: <TranslateIcon color="secondary"/>, name: messages.menu.translate },
    { icon: <SaveIcon color="secondary"/>, name: messages.menu.save },
    { icon: <FileCopyIcon color="secondary"/>, name: messages.menu.duplicate },
    { icon: <PublishIcon color="secondary"/>, name: messages.menu.publish },
    { icon: <ShareIcon color="secondary"/>, name: messages.menu.share},
  ];
  const handleVisibility = () => {
    setHidden((prevHidden) => !prevHidden);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleActionClick = ({e, func, param1, param2}) => {
    if (typeof func === 'function') {
      console.log(param1, param2);
      return toggleDrawer('bottom', true);
    }
    handleClose();
  }
  return (
    <div className={classes.root}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="Menu"
        className={classes.speedDial}
        hidden={hidden}
        size={"small"}
        style={{}}
        direction={'down'}
        icon={<Avatar size={"tiny"} style={{fontSize: 9}} className={classes.logoIcon} alt="logo" src={logo} />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
      >
        {actions.map((action) => (
          <SpeedDialAction
            key={action.name}
            icon={action.icon}
            tooltipTitle={action.name}
            tooltipOpen
            onClick={toggleDrawer(action.drawer, action.open)}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
export default Fab
