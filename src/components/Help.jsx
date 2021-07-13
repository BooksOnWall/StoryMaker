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
import { experimentalStyled as styled } from '@material-ui/core/styles';
import ReactMarkdown from 'react-markdown';
import { useIntl } from 'react-intl';
import helpSummary from "../indexes/helpSummary";
const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

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
  backgroundColor: 'rgba(255, 0, 0, 0.5)',
  color: theme.palette.text.secondary,
}));
const Help = ({messages, className}) => {
  const index = helpSummary(messages);
  const [open, setOpen] = useState(false);
  const [chapter, setChapter] = useState();
  const [selectedId, setSelectedId] = useState();
  const [markdown, setMarkdown] = useState();
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
 const handleChapter = (chapter) => {
   setChapter(chapter);
   setSelectedId((chapter) ? index.filter((c) => (c.name === chapter))[0].id : null);
   const md = require('../help/'+locale+'/'+chapter+'.md');
   // fetch(Md).then((response) => response.text()).then((text) => {
   //   setMarkdown(text);
   // })
   fetch(md).then((response) => response.text()).then((text) => {
     setMarkdown(text);
   });

 };
 useEffect(()=> {
   if (selectedId && selectedId < (index.length -1) && index[(1+selectedId)]) {
     console.log('selectedId: ', selectedId);
     console.log('ici')
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
 },[chapter, index, selectedId]);
  console.log('selectedId', selectedId);
  console.log('next', next);
  console.log('prev', prev);
  console.log('chapter', chapter);
  console.log('index length', index.length);
  return (
    <>
    <IconButton onClick={handleClickOpen} className={className} style={{fontSize: 12, color: '#FFF',position: 'absolute', zIndex: 1008, right: '8vw'}}><HelpIcon fontSize="large" color="primary"/></IconButton>
    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        PaperComponent={PaperComponent}
        onClose={handleClose}
        style={{backgroundColor: 'transparent'}}
        aria-describedby="help"
      >
        <DialogTitle style={{color: '#FFF', cursor: 'move'}} >{"Need Help ?"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
            {!chapter && index && index.map((c,i) => (
              <Grid item style={{cursor: 'pointer'}} onClick={() => handleChapter(c.name)} xs={2} sm={4} md={4} key={i}>
                <Item>{c.name}</Item>
              </Grid>
            ))}
            </Grid>
          {chapter &&
            <>

            <DialogContentText >
              <h1>{chapter}</h1>
              <ReactMarkdown children={markdown} />
            </DialogContentText>
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
