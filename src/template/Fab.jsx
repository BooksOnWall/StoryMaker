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
import logo from '../assets/images/logo.svg';

const useStyles = makeStyles((theme) => ({
  root: {
    position: 'absolute',
    top: 0,
    left: '50vw',
    maxHeight: 308,
    zIndex: 1006,
    transform: 'translateZ(0px)',
    flexGrow: 1,
  },
  logo:{
    position: 'absolute',
    zIndex: '1006',
    padding: 0,
    marginTop: 0,
    marginLeft: '0',
  },
  logoIcon:{
    minHeight: 12,
    minWidth: 12,
    background: '#fff',
    padding: 1
  },
  speedDial: {
    position: 'absolute',
    width: 12,
    zIndex: 1007,
    '&.MuiSpeedDial-directionUp, &.MuiSpeedDial-directionLeft': {
      bottom: theme.spacing(2),
      right: theme.spacing(2),
    },
    '&.MuiSpeedDial-directionDown, &.MuiSpeedDial-directionRight': {
      top: theme.spacing(2),
      left: theme.spacing(2),
    },


  },
}));


  const Fab = ({toggleDrawer}) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const actions = [
    { icon: <CreateNewFolderIcon color="secondary"/>, name: 'New' },
    { icon: <MovieIcon color="secondary"/>, name: 'Timeline' , drawer: 'bottom', open: 'true'},
    { icon: <TuneIcon color="secondary"/>, name: 'Configure' },
    { icon: <TranslateIcon color="secondary"/>, name: 'Translate' },
    { icon: <SaveIcon color="secondary"/>, name: 'Save' },
    { icon: <FileCopyIcon color="secondary"/>, name: 'Duplicate' },
    { icon: <PublishIcon color="secondary"/>, name: 'Publish' },
    { icon: <ShareIcon color="secondary"/>, name: 'Share' },
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
        direction={'down'}
        icon={<IconButton className={classes.logo} edge="start"  color="primary" aria-label="menu">
          <Avatar className={classes.logoIcon} alt="logo" src={logo} />
        </IconButton>}
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
