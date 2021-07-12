import React , {useState, useEffect} from 'react';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import EventSeatIcon from '@material-ui/icons/EventSeat';
import IconButton from '@material-ui/core/IconButton';
import {makeStyles} from '@material-ui/styles';
const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'transparent'
  },
  events: {
    position: 'absolute',
    zIndex: 1007,
    left: 10,
    padding: 0,
    color: '#FFFFFF',
    backgroundColor: 'transparent',
    margin: 0,
    fontSize: 8,
  },
  eventMenu: {
    backgroundColor: 'transparent',
    color: '#FFF',
    fontSize: 8,
  },
  eventItem: {
    backgroundColor: 'transparent',
    fontSize: 8,
  }
}));
const options = [
  'onStart',
  'onStageEnter',
  'onMain',
  'onGpsMatch',
  'onPictureMatch',
  'onObjectMatch',
  'onStageLeave',
  'onEnd'
];
const Events = ({messages}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuItemClick = (event, index) => {
    setSelectedIndex(index);
    setAnchorEl(null);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
      <div className={classes.root} style={{zIndex: 1001, backgroundColor: 'transparent',color: '#FFF',position: 'absolute', left: '10vw'}}>
      <IconButton onClick={handleClickListItem} className={classes.events} style={{color: '#FFF', fontSize: 8}}><EventSeatIcon fontSize="large" color="primary"/>{options[selectedIndex]}</IconButton>
      <Menu
        id="lock-menu"
        anchorEl={anchorEl}
        keepMounted
        className={classes.eventMenu}
        open={Boolean(anchorEl)}
        style={{backgroundColor: 'transparent', color: '#FFF'}}
        onClose={handleClose}
      >
        {options.map((option, index) => (
          <MenuItem
            key={option}
            // disabled={index === 0}
            style={{background: 'transparent', color: '#FFF'}}
            selected={index === selectedIndex}
            className={classes.MenuItem}
            onClick={(event) => handleMenuItemClick(event, index)}
          >
            {option}
          </MenuItem>
        ))}
      </Menu>
      </div>
  );
}
export default Events;
