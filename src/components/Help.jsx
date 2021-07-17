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
import Slide from '@material-ui/core/Slide';
import Draggable from 'react-draggable';
import IconButton from '@material-ui/core/IconButton';
import HelpIcon from '@material-ui/icons/Help';
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
  ul: {
    listStyleType: 'circle',
    width: '50vw',
    color: '#FFF',
  },
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
  const handleClickOpen = () => {
   setOpen(true);
 };
 const {locale} = useIntl();
 const handleClose = () => {
   setOpen(false);
   setChapter();
   setNext();
   setPrev();
   setSelectedId();
 };

 const handleChapter = async (chapter) => {
   try {
     setChapter(chapter);
     setSelectedId((chapter) ? index.filter((c) => (c.name === chapter))[0].id : null);
   } catch(e) {
     console.log(e.message);
   }

 };
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
   } else {
     setPrev();
   }
 },[chapter, index, selectedId, locale]);
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
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
