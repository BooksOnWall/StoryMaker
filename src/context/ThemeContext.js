import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { themes } from '../theme/globalStyle';

// Context is made up of two things
// Provider - Single as close to top level as possible
// Consumer - Multiple have multiple consumers
const ThemeContext = React.createContext();
export default ThemeContext;

export class ThemeProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: themes['theme1']
    };
  }
  handleThemeChange = e => {
    const key = e.target.value;
    const theme = themes[key];
    this.setState({ theme });
  };
  render() {
    return (
      <ThemeContext.Provider
        value={{
          ...this.state,
          handleThemeChange: this.handleThemeChange
        }}
      >
        {this.props.children}
      </ThemeContext.Provider>
    );
  }
}

ThemeProvider.propTypes = {
  children: PropTypes.any
};
