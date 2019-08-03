import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { locales } from '../i18n/locales/globalLocales';

// Context is made up of two things
// Provider - Single as close to top level as possible
// Consumer - Multiple have multiple consumers
const LocaleContext = React.createContext({
  locale: "en",
  setLocale: () => {}
});
export default LocaleContext;

export class LocaleProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      theme: locales['en']
    };
  }
  handleLocaleChange = e => {
    const key = e.target.value;
    const theme = locales[key];
    this.setState({ theme });
  };
  render() {
    return (
      <LocaleContext.Provider
        value={{
          ...this.state,
          handleLocaleChange: this.handleLocaleChange
        }}
      >
        {this.props.children}
      </LocaleContext.Provider>
    );
  }
}

LocaleProvider.propTypes = {
  children: PropTypes.any
};
