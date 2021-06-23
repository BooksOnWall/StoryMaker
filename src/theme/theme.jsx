import { createMuiTheme, responsiveFontSizes } from '@material-ui/core/styles';

import "@fontsource/roboto"
import "@fontsource/roboto-condensed"
import "@fontsource/roboto-condensed/700.css"
import "@fontsource/roboto-condensed/400.css"
import "@fontsource/source-sans-pro"
import "@fontsource/roboto-mono"

let theme = createMuiTheme({
palette: {
  common: {
    white: '#FEFEFE',
    black: '#131413',
  },
  background: {
      paper: '#fff',
      default: '#FAFAFA',
  },
  text: {
    light: '#131413',
    dark: '#FEFEFE',
    primary: '#131413',
    secondary: '#FEFEFE',
    disabled: '#FF9999',
    hint: '#339395'
  },
  primary: {
    light: '#cc6649', //will be calculated from palette.primary.main,
    main: '#91201F',
    dark: '#893E4E', //will be calculated from palette.primary.main,
    contrastText: '#FEFEFE', //will be calculated to contrast with palette.primary.main
    mainGradient: 'linear-gradient(0deg, rgba(190,66,81,.8) 0%, rgba(224,161,3,.8) 100%)',
    darkGradient: 'linear-gradient(0deg, rgba(20, 0, 100, .88) 0%, rgba(190,66,81,.88) 100%)',
  },
  secondary: {
    light: '#34729e',
    main: '#186858',
    dark: '#424675', //will be calculated from palette.secondary.main,
    contrastText: '#FEFEFE',
    mainGradient: 'linear-gradient(0deg, rgba(56,142,60, 0.88) 0%, rgba(0,153,153, 0.88) 100%)'
  },
  success: {
    light: '#81c784',
    main: '#339D66',
    dark: '#186858',
    contrastText: 'rgba(0, 0, 0, 0.87)',
  },
  error: {
    light: '#C90049',
    main: '#C33949',
    dark: '#C00000', //will be calculated from palette.secondary.main,
    contrastText: '#FEFEFE',
  },
  info: {
    light: '#C33949',
    main: '#2577BB',
    dark: '#000055', //will be calculated from palette.secondary.main,
    contrastText: '#FEFEFE',
  },
},
  typography: {
  fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
  fontSize: 15,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightBold: 700,
  letterSpacing: 'normal',
  body1:{
    fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
    fontSize: "1.54rem",
    lineHeight: 1.598,
    maxWidth: 800,
  },
  body2:{
    fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
    fontSize: "1.1rem",
    lineHeight: 1.45,
  },
  body3:{
    fontFamily: '"Open Sans", Helvetica, Arial, sans-serif',
    fontSize: "1rem",
    lineHeight: 1.2,
    maxWidth: 800
  },
  h1: {
    fontWeight: 700,
    fontSize: "4.44rem",
    lineHeight: .98,
    fontFamily: '"Roboto Condensed", Helvetica, Arial, sans-serif',
    maxWidth: 800
  },
  h2: {
    fontWeight: 700,
    fontSize: "3.8rem",
    lineHeight: 1,
    fontFamily: '"Roboto Condensed", Helvetica, Arial, sans-serif',
    maxWidth: 800
  },
  h3: {
    fontWeight: 400,
    fontSize: "2.6rem",
    lineHeight: 1.2,
    fontFamily: '"Roboto Condensed", Helvetica, Arial, sans-serif',
    letterSpacing: -.1
  },
  h4: {
    fontWeight: 700,
    fontSize: "2rem",
    lineHeight: 1.2,
    fontFamily: '"Roboto Condensed", Helvetica, Arial, sans-serif',
    letterSpacing: 'normal',
  },
  h5: {
    fontWeight: 700,
    fontSize: "2rem",
    fontFamily: '"Roboto Condensed", Helvetica, Arial, sans-serif',
    lineHeight: 1.1,
    textTransform: "uppercase",
  },
  h6: {
    fontWeight: 700,
    fontSize: "1.3rem",
    fontFamily: '"Roboto Condensed", Helvetica, Arial, sans-serif',
    textTransform: "uppercase",
    lineHeight: 1.2,
  },
  subtitle1:{
    fontSize: "1.66rem",
    lineHeight: 1.4,
    fontFamily: '"Roboto Condensed", Helvetica, Arial, sans-serif',
  },
  subtitle2:{
    fontSize: "1.3rem",
    lineHeight: 1.33,
    fontFamily: '"Roboto Mono", Helvetica, Arial, sans-serif',
  },
  button:{
    fontSize: "1rem",
    fontWeight: 700,
    fontFamily: '"Roboto Condensed", Helvetica, Arial, sans-serif',
    textTransform: "uppercase",
    letterSpacing: "0.02877em",
  },
},
overrides: {
  MuiTableCell: {
    borderBottomWidth: '1px',
    borderBottomStyle: 'solid',
    borderBottomColor: '#FF9900',
  },
  MuiDivider: {
    backgroundColor: "#FEFEFE"
  },
  MuiInputLabel:{
    formControl:{
          fontSize: '1.3rem',
          fontFamily: '"Roboto Condensed", Helvetica, Arial, sans-serif',
    }
  },
  MuiInputBase: {
    formControl:{
      fontSize: '1.3rem',
      fontFamily: '"Roboto Condensed", Helvetica, Arial, sans-serif',
    }
  }
},
shape:{
  borderRadius: 4
},
});
theme = responsiveFontSizes(theme);

export {theme};
