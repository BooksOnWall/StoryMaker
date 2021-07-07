import React , {useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import Backdrop from '@material-ui/core/Backdrop';
import SpeedDial from '@material-ui/lab/SpeedDial';
import SpeedDialIcon from '@material-ui/lab/SpeedDialIcon';
import SpeedDialAction from '@material-ui/lab/SpeedDialAction';
import FileCopyIcon from '@material-ui/icons/FileCopyOutlined';
import SaveIcon from '@material-ui/icons/Save';
import PrintIcon from '@material-ui/icons/Print';
import ShareIcon from '@material-ui/icons/Share';
import FavoriteIcon from '@material-ui/icons/Favorite';
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
    position: 'absoute',
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

const actions = [
  { icon: <FileCopyIcon color="secondary"/>, name: 'New' },
  { icon: <SaveIcon color="secondary"/>, name: 'Timeline' },
  { icon: <SaveIcon color="secondary"/>, name: 'Configure' },
  { icon: <SaveIcon color="secondary"/>, name: 'Save' },
  { icon: <PrintIcon color="secondary"/>, name: 'Publish' },
  { icon: <ShareIcon color="secondary"/>, name: 'Share' },
];
  const Menu = () => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);

  const handleVisibility = () => {
    setHidden((prevHidden) => !prevHidden);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root}>
      <Backdrop open={open} />
      <SpeedDial
        ariaLabel="Menu"
        className={classes.speedDial}
        hidden={hidden}
        direction={'down'}
        icon={<IconButton className={classes.logo} edge="start"  color="primary" aria-label="menu">
          <Avatar className={classes.logoIcon}   alt="logo" src={logo} />
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
            onClick={handleClose}
          />
        ))}
      </SpeedDial>
    </div>
  );
}
export default Menu
