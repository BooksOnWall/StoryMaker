import React, {useState} from "react";
import {Menu, MenuItem, IconButton} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import { CircleFlag } from 'react-circle-flags';


const languageOptions = [
  'en',
  'es',
  'pt',
  'it',
  'fr'
];

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: 'transparent',
  },
  list:{
    display: 'block',
    position: 'absolute',
    top: 0,
    right: '4vh',
    margin: 0,
    padding: 0,
  },
  menulist:{
    marginTop: 0,
    marginLeft: -11,
    padding: 0,
  },
  menuItem: {
    padding: 8,
    margin: '0 5px 0 15px',
    background: 'rgba(0, 0, 0, 0)',
  },
  menuItemItem: {
    display: 'block',
    padding: 15
  },
  menuItemButton:{
    zIndex: 1002,
    position: 'absolute',
    top: 0,
    left: '8vw',
    padding:0,
  },
  menuItemIcon:{

  },
  menuItemText:{
  },
  menuList: {

    padding: 0,
    margin: 5,
  },
  menuIcon:{
  }
}));

const LanguageSwitch = ({switchLang, history, allMessages, messages, locale}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);

  const onLocaleChange = (lang) => {
    switchLang(lang);
    handleClose();
  }
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
    <IconButton className={classes.menuItemButton} style={{position: 'absolute',left: '25vw' }} onClick={handleClickListItem}><CircleFlag  className={classes.menuItemIcon}  fontSize="large" countryCode={ (locale !== "en") ? locale : "gb" } height="30"/></IconButton>
    <Menu
      id="Language"
      anchorEl={anchorEl}
      keepMounted
      open={Boolean(anchorEl)}
      name="language"
      onClose={handleClose}
      className={classes.menulist}
      elevation={1}
      >
      {languageOptions.map((option, index) => (
        <MenuItem
          key={"lang"+index}
          name={option}
          value={option}
          selected={option === locale}
          onClick={(e) => onLocaleChange(option)}
          className={classes.menuItemItem}
          >
          <CircleFlag countryCode={ (option !== "en") ? option : "gb" } height="22"/>
        </MenuItem>
      ))}
    </Menu>
    </>
  );
};

export default LanguageSwitch;
