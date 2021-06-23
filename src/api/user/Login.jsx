import React, { Component } from 'react';

import {
  List,
  ListItem,
  Modal,
  Divider,
  TextField,
  Button,
  ButtonGroup,
  IconButton,
  makeStyles,
  Typography,
  Backdrop } from '@material-ui/core';
import { defineMessages, injectIntl } from 'react-intl';
import Auth from './Auth';

import AccountCircleIcon from '@material-ui/icons/AccountCircle';
const apiURL = process.env.REACT_APP_API;
const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    background: theme.palette.primary.mainGradient,
    position: 'relative',
    width: '50vw',
    maxHeight: '40vh',
    minHeight: '30vh',
    zIndex: '1300',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '2vh',
    flexDirection: 'column',
    flexWrap: 'no-wrap',
    boxShadow: theme.shadows[1],
    padding: 40,
    borderRadius: 15,
    overflow: 'hidden'
  },
  bg:{
    borderRadius: 15,
    overflow: 'hidden'
  },
    menuItem:{
      padding: 0,
      margin: '0',
      background: 'rgba(0, 0, 0, 0)',
    },
    menuItemButton:{
      padding:0,
      margin: 0,
      '&:hover':{
        padding: 0
      }
    },
  input: {
    margin: 20,
    minWidth: '300px'
  },
  buttonGroup:{
    padding: "30px 0 0"
  }
}));

const loginTraductions = defineMessages({
  title: {
    id: 'login.title',
    defaultMessage: 'Login',
  },
  login: {
    id: 'login.login',
    defaultMessage: 'Go!',
  },
  name: {
    id: 'login.email',
    defaultMessage: 'Email',
  },
  passworrd: {
    id: 'login.password',
    defaultMessage: 'Password',
  },
  cancel: {
    id: 'login.cancel',
    defaultMessage: 'Cancel',
  },
});
 const  LoginModal = ({values ,email, password, messages, handleChange, handleSubmit, login }) => {
   const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
   return (
     <>
        <List component="nav" aria-label="Connect" className="nav">
          <ListItem
            value="Login"
            aria-haspopup="true"
            aria-controls="connect"
            aria-label="Login"
            onClick={handleOpen}
            className={classes.menuItem}
            >
            <IconButton className={classes.menuItemButton}><AccountCircleIcon className={classes.menuItemIcon} fontSize="large"/></IconButton>
          </ListItem>
        </List>
      <Modal
        disableEnforceFocus
        aria-labelledby="spring-modal-title"
        aria-describedby="spring-modal-description"
        className={classes.modal}
        open={open}
        onClose={handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
          <div className={classes.paper}>
  
            <Typography color="textSecondary" variant="h6" component="h2">{messages.login.title}</Typography>
            <TextField
              color="secondary"
              inputProps={{ 'aria-label': 'email' }}
              onChange={(e) => handleChange(e)}
              type="text"
              name="email"
              defaultValue={values.email}
              placeholder={messages.login.email}
              label={messages.login.email}
              autoFocus={true}
              className={classes.input}
              />
            <Divider />

            <TextField
              color="secondary"
              inputProps={{ 'aria-label': 'password' }}
              defaultValue={messages.login.password}
              label={messages.login.password}
              placeholder={messages.login.password}
              type="password"
              name="password"
              onChange={(e) => handleChange(e)}
              className={classes.input}
              />
            <ButtonGroup className={classes.buttonGroup}>
            <Button elevation={1} variant="contained" color="primary" onClick={login}>{messages.login.login}</Button>
            <Button elevation={1} variant="contained" color="primary" onClick={handleClose}>{messages.login.cancel}</Button>
            </ButtonGroup>
          </div>
      </Modal>
    </>
   );
 };
 class Login extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loginTraductions: loginTraductions,
      apiURL: apiURL,
      open: false,
      email: '',
      login: '',
      password: '',
      name: '',
      initialState: {
        email: '',
        password: ''
      },
    };
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    // update authenticated state on logout

  }

  login = async () => {
    const { apiURL, email, password } = this.state;
    const fetchURL = apiURL + '/auth/local';
    this.setState({loading: true});
    console.log(email);
    console.log(password);
    console.log("URL",fetchURL );
    let form= {
        "identifier": email,
        "password": password
      };
      try {
        await fetch(fetchURL, {
          method: "POST",
          headers: {"Content-Type":"application/json"},
          body: JSON.stringify(form)
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              Auth.authenticateUser(data);
              this.props.history.push("/Dashboard");
            } else {
              console.log('No Data received from the server');
            }
        })
        .catch((error) => {
          // Your error is here!
          if(error) console.log(JSON.stringify(error));
        });
      } catch(e) {
        console.log(e.message);
      }

  }
  handleChange = (e,o) => {

    if(e) this.setState({ [e.target.name]: e.target.value });
  }
  handleOpen = () => {
    this.setState({open: true});
  }
  handleClose = () => {
    this.setState({open: false});
  }
  render() {
    const { email , password, open} = this.state;
    const {messages} = this.props;
    const values = {email, password};
    return (

      <LoginModal
        email={email}
        password={password}
        open={open}
        messages={messages}
        handleChange={this.handleChange}
        handleSubmit={this.handleSubmit}
        login={this.login}
        values={values}
        />

    );
  }
}
export default injectIntl(Login);
