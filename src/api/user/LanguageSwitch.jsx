import React, {useState} from "react";
import {List, ListItem, Menu, makeStyles, MenuItem, IconButton} from '@material-ui/core';
import { CircleFlag } from 'react-circle-flags';
import { useLocation } from 'react-router-dom';

const languageOptions = [
  'en',
  'es',
  'pt',
  'it',
  'fr'
];

const useStyles = makeStyles((theme) => ({
  root: {
    backgroundColor: theme.palette.primar,
  },
  list:{
    margin: 0,
    padding: 0,
  },
  menulist:{
    marginTop: 64,
    marginLeft: -11,
    padding: 0,
  },
  menuItem: {
    padding: 8,
    margin: '0 5px 0 15px',
    background: 'rgba(0, 0, 0, 0)',
},
  menuItemItem: {
    padding: 15
  },
  menuItemButton:{
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

const LanguageSwitch = ({locale, switchLang, messages, history, allMessages}) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = useState(null);
  const {pathname, hash} = useLocation();
  const translatePath = (pathname, hash, newLang) => {
    let pathKey = null;
    let hashKey = null;
    for (const [key, value] of Object.entries(messages.menu)) {
      if(value === pathname.substring(1)) {
         pathKey = key;
      }
      if(value === decodeURIComponent(hash.substring(1))) {
        hashKey = key;
      }
    }
    return {path: (pathKey) ? '/'+ allMessages[newLang].menu[pathKey] : '/', hash: (hashKey) ? '#'+allMessages[newLang].menu[hashKey] : ''}
  }
  const onLocaleChange = (lang) => {
    const newPath = translatePath(pathname, hash, lang);
    switchLang(lang);
    handleClose();
    if(newPath) history.push(newPath.path+newPath.hash);
  }
  const handleClickListItem = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>

    <List className={classes.list} disablePadding component="nav" aria-label="Language">
      <ListItem
        aria-haspopup="true"
        aria-controls="Language"
        aria-label="Languages"
        className={classes.menuItem}
        >
          <IconButton className={classes.menuItemButton} onClick={handleClickListItem}><CircleFlag  className={classes.menuItemIcon} fontSize="large" countryCode={ (locale !== "en") ? locale : "gb" } height="30"/></IconButton>
      </ListItem>
    </List>

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
