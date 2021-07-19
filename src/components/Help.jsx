import React, {forwardRef, useState, useEffect} from 'react';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Avatar from '@material-ui/core/Avatar';
import FolderIcon from '@material-ui/icons/Folder';
import DeleteIcon from '@material-ui/icons/Delete';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Draggable from 'react-draggable';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
import ScrollIntoViewIfNeeded from 'react-scroll-into-view-if-needed';
import Box from '@material-ui/core/Box';
import TrapFocus from '@material-ui/core/Unstable_TrapFocus';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { experimentalStyled as styled } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import {makeStyles} from '@material-ui/styles';
import Markdown from 'markdown-to-jsx';
import { useIntl } from 'react-intl';
import helpSummary from "../indexes/helpSummary";

const useStyles = makeStyles((theme) => ({
  markdown: {
    margin: 0,
    padding: 0,
    overflow: 'hidden',
    fontSize: '1em',
    color: '#FFF',
    backgroundColor: 'transparent',
  },
  content: {
    backgroundColor: 'rgba(255, 0, 0, 0.5)',
  },
  internalLink: {
    cursor: 'pointer',
    color: '#FF9900'
  },
  bottom: {
    cursor: 'pointer',
  },
  p:{
    margin: 0,
    color: '#FFF',
    padding: 0,
  },
  li: {
    alignItems: 'start',
    fontSize: '1.5rem',
    lineHeight: 1.25,
    color: '#FFF',
    '& em:after': {
      mapfinRight: '1em',
    },

  },
  menu: {
    position: 'absolute',
    right: '1vw',
    zIndex: 1004,
    top: 20

  },
  list: {
    padding: 0,
    margin: 0,
  },
  menuItem: {
    padding: 0,
    color: '#FF9900',
    margin: 0,
  },
  ul: {
    listStyleType: 'circle',
    width: '50vw',
    color: '#FFF',
  },
  h1: { color: '#FFF' },
  h2: { color: '#FFF', marginLeft: '2vw' },
  h3: { color: '#FFF', marginLeft: '4vw' },
  h4: { color: '#FFF', marginLeft: '6vw' },
  link: {
    cursor: 'pointer',
    listStyleType: 'circle',
    color: '#FF9900'
  }
}));


const PaperComponent = (props) => {
  return (
    <Draggable
      handle="#help"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper id="help" {...props} />
    </Draggable>
  );
}
const Item = styled(Paper)(({ theme }) => ({
  ...theme.typography.body2,
  padding: theme.spacing(2),
  textAlign: 'center',
  backgroundColor: 'rgba(255, 0, 255, 0.5)',
  color: theme.palette.text.secondary,
}));

const HelpMenu = ({menu, handleScrollName}) => {
  const classes = useStyles();
  console.log('handleScrollName', handleScrollName);
  const [dense, setDense] = useState(false);
  const [secondary, setSecondary] = useState(false);
  const [open, setOpen] = useState(false);
  const handleClick = (name, i) => {
    handleScrollName({name});
    if(i === 0) setOpen(!open);
  }
  return (
    <div className={classes.menu}>
       {menu && menu.map((l,i) => (
            <>
            <Button color="secondary" variant="contained" key={i} onClick={() => handleClick(l.name,i)} className={classes.menuItem} style={{padding: 0, margin: 0, color: '#FF9900'}}>{l.name}</Button>
             {l.children.length > 0 &&
               <>
               {open && (
                 <TrapFocus open={open} disableAutoFocus>
                   <Box tabIndex={-1} sx={{ mt: 1, p: 1 }}>
                     <List style={{padding: 0, margin: 0}} dense={dense}>
                     {l.children.map((ll,ii) => (
                       <ListItem key={ii} style={{padding: 0, margin: 0}}>
                        <Button onClick={() => handleClick(ll.name)} className={classes.menuItem} style={{color: '#FF9900',padding: 0, margin: 0}}>{ll.name}</Button>
                            {ll.children.length > 0 &&
                              <List style={{padding: 0, margin: 0}} dense={dense}>
                               {ll.children.map((lll, iii) => (
                                 <ListItem key={iii} style={{padding: 0, margin: 0}}>
                                  <Button  onClick={() => handleClick(lll.name)} className={classes.menuItem} style={{color: '#FF9900', padding: 0, margin: 0}}>{lll.name}</Button>
                                 </ListItem>
                               ))}
                               </List>
                            }
                          </ListItem>
                     ))}
                     </List>
                     </Box>
                  </TrapFocus>
                )}
                </>
              }
            </>
          ))}
    </div>
  )
}
const Help = ({messages, className}) => {
  const classes = useStyles();
  const theme = useTheme();
  const index = helpSummary(messages);
  const [open, setOpen] = useState(false);
  const [chapter, setChapter] = useState();
  const [selectedId, setSelectedId] = useState();
  const [markdown, setMarkdown] = useState('');
  const [next, setNext] = useState();
  const [prev, setPrev] = useState();
  const [menu, setMenu] = useState([]);
  const [scrollName, setScrollName] = useState();
  const handleClickOpen = () => {
   setOpen(true);
 };
 const handleScroll = ({name}) => {
  setScrollName(name);
 }

 const {locale} = useIntl();
 const handleClose = () => {
   setOpen(false);
   setChapter();
   setMenu([]);
   setNext();
   setPrev();
   setSelectedId();
 };

 const handleChapter = async (chapter) => {
   try {
     setChapter(chapter);
     setMenu([]);
     setSelectedId((chapter) ? index.filter((c) => (c.name === chapter))[0].id : null);
   } catch(e) {
     console.log(e.message);
   }
 };

 const handleMenu = (name, depth) => {
   let m = menu;
   let m1Index = undefined;
   let m0Index = (m && m.length === 0) ? 0 : (m.length -1);
   // Menu items start for index === O or h1
   switch(depth) {
     case 0:
     // h1
     if(!m.find((c) => (c.name === name))) m.push({name, children:[]});
     break;
     case 1:
     // h2
     m1Index = (m[m0Index] && m[m0Index].children.length === 0) ? 0 : (m[m0Index].children.length -1);
     if(!m[m0Index].children[m1Index] || !m[m0Index].children.find((c) => (c.name === name))) m[m0Index].children.push({name, children:[]});
     break;
     case 2:
     // h3
     m1Index = (m[m0Index].children.length === 0) ? 0 : (m[m0Index].children.length -1);
     if(!m[m0Index].children[m1Index].children && !m[m0Index].children[m1Index].children.find((c) => (c.name === name))) m[m0Index].children[m1Index].children.push({name, children:[]});
     break;
     case 3:
     // h4
     let m2Index = (m[m0Index].children[m1Index].length === 0) ? 0 : (m[m0Index].children[m1Index].length -1);
     console.log('toto');
     break;
     default:
     break;
   }
   setMenu(m);
 }
 useEffect(()=> {
   if(chapter) {
     const mpath = require('./help/'+locale+'/'+chapter+'.md');
     fetch(mpath.default)
    .then(response => {
      return response.text()
    })
    .then(text => {
      setMarkdown(text);
    })
   }
   if (selectedId && selectedId < (index.length -1) && index[(1+selectedId)]) {
     setNext(index[(1+selectedId)].name);
   }
   if (selectedId && selectedId === 0) {
     setNext(index[1].name);
   }
   if (selectedId && selectedId > 0 && index[(1-selectedId)]) {
     setPrev(index[(1-selectedId)].name);
   }
 },[chapter, index, selectedId, locale]);
  useEffect(() => {
    if(menu && menu[0]) handleScroll({name: menu[0].name});
  }, [menu])
  const options = {behavior: 'smooth', scrollMode: 'if-needed'}

  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  console.log('scrollName', scrollName)
  return (
    <>
    <IconButton onClick={handleClickOpen} className={className} style={{fontSize: 12, color: '#FFF',position: 'absolute', zIndex: 1008, right: '8vw'}}><HelpIcon fontSize="large" color="primary"/></IconButton>
    <Dialog
        open={open}
        keepMounted
        PaperComponent={PaperComponent}
        onClose={handleClose}
        fullScreen={fullScreen}
        style={{backgroundColor: 'transparent'}}
        aria-describedby="help"
      >
        <DialogTitle style={{color: '#FFF', cursor: 'move'}} >{"Need Help ?"}</DialogTitle>
        <DialogContent className={classes.content} >
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {!chapter && index && index.map((c,i) => (
              <Grid item style={{cursor: 'pointer'}} onClick={() => handleChapter(c.name)} xs={2} sm={4} md={4} key={i}>
                <Item>{c.name}</Item>
              </Grid>
            ))}
            </Grid>
          {chapter &&
            <>
              {markdown &&
                <>
                <HelpMenu handleScrollName={handleScroll} menu={menu} />
                <Markdown
                  children={markdown}
                  options={{
                      disableParsingRawHTML: true,
                      createElement(type, props, children) {
                          if(type === 'a') {
                            // separate internal Links that use handleChapter and external ones that use href
                            let p = props;
                            if(!props.href.includes('http')) {
                              p.href=undefined;
                              p.onClick=()=>handleChapter(children[0])
                              p.className = classes.internalLink;
                            } else p.className = classes.link;
                            return  React.createElement(type, p, children);
                          }
                          if(type === 'p') {
                            // separate internal Links that use handleChapter and external ones that use href
                            let p = props;
                            p.className = classes.p;
                            return  React.createElement(type, p, children);
                          }
                          if(type === 'li') {
                            // separate internal Links that use handleChapter and external ones that use href
                            let p = props;
                            p.className = classes.li;
                            return  React.createElement(type, p, children);
                          }
                          if(type === 'h1') {
                            // separate internal Links that use handleChapter and external ones that use href
                            let p = props;
                            console.log(children[0])
                            handleMenu(children[0],0);
                            p.className = classes.h1;
                            p.onClick=()=>handleScroll(children[0]);
                            return  <ScrollIntoViewIfNeeded options={options} active={true}>{React.createElement(type, p, children)}</ScrollIntoViewIfNeeded>;
                          }
                          if(type === 'h2') {
                            // separate internal Links that use handleChapter and external ones that use href
                            let p = props;
                            handleMenu(children[0],1);
                            p.onClick=()=>handleScroll(children[0]);
                            p.className = classes.h2;
                            return  <ScrollIntoViewIfNeeded options={options}  active={(scrollName === children[0])}>{ React.createElement(type, p, children) }</ScrollIntoViewIfNeeded>;
                          }
                          if(type === 'h3') {
                            // separate internal Links that use handleChapter and external ones that use href
                            let p = props;
                            handleMenu(children[0],2);
                            p.onClick=()=>handleScroll(children[0]);
                            p.className = classes.h3;
                            return  <ScrollIntoViewIfNeeded options={options} active={(scrollName === children[0])}>{React.createElement(type, p, children)}</ScrollIntoViewIfNeeded>;
                          }
                          if(type === 'h4') {
                            // separate internal Links that use handleChapter and external ones that use href
                            let p = props;
                            handleMenu(children[0],3);
                            p.onClick=()=>handleScroll(children[0]);
                            p.className = classes.h4;
                            return  <ScrollIntoViewIfNeeded options={options} active={(scrollName === children[0])}>{React.createElement(type, p, children)}</ScrollIntoViewIfNeeded>;
                          }
                          if(type === 'ul' || type === 'ol') {
                            // separate internal Links that use handleChapter and external ones that use href
                            let p = props;
                            p.className = classes.ul;
                            return  React.createElement(type, p, children);
                          }
                          return (
                              React.createElement(type, props, children)
                          );
                      },
                  }} />
                  </>
              }
            </>
          }
        </DialogContent>
        <DialogActions>
        <ButtonGroup variant="contained" aria-label="outlined primary button group">
          {chapter && <Button color="secondary" variant="contained" onClick={() => handleChapter()}>Summary</Button>}
          {prev && <Button  color="secondary" variant="contained" onClick={() => handleChapter(prev)}>{prev}</Button>}
          {next && <Button  color="secondary" variant="contained" onClick={() => handleChapter(next)}>{next}</Button>}
        </ButtonGroup>

        </DialogActions>
        <DialogActions>
          <Button color="primary" variant="contained" onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
      </>
  )
}
export default Help;
