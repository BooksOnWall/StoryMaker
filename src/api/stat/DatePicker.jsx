import React, { useContext, useState, useEffect, createContext } from 'react';
import { Menu, Segment, Label,Dimmer, Loader } from 'semantic-ui-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import Helmet from 'react-helmet';
// Include the locale utils designed for moment
import MomentLocaleUtils from 'react-day-picker/moment';

// Make sure moment.js has the required locale data
import 'moment/locale/es';
import 'moment/locale/en-gb';
import 'moment/locale/it';
import 'moment/locale/fr';
import 'moment/locale/pt';

const getLanguage = () => (navigator.languages && navigator.languages.length) ? navigator.languages[0] : navigator.userLanguage || navigator.language || navigator.browserLanguage || 'en';

const DatePicker = ({period}) => {
  return (
    <>
    <Helmet>
        <style>{`
          .DayPickerInput-OverlayWrapper {
            z-index: 999;
            position: absolute;
          }
          `}</style>
      </Helmet>

      {period === 'day' &&
        <Menu.Item>
          <DayPickerInput
            placeholder="Select Date"
            inputProps={{ className: 'picker-control' }}
            style={{color: '#000', backgroundColor: '#00bcd4'}}
            onDayChange={day => console.log(day)}
            dayPickerProps={{
              todayButton: 'Today',
            }}
            keepFocus={false}
          />
          </Menu.Item>
      }
      {period != 'day' &&
        <>
        <Menu.Item style={{fontSize: 10}}  >Start: dd/mm/yy</Menu.Item>
        <Menu.Item style={{fontSize: 10}}  >End: dd/mm/yy</Menu.Item>
        </>
      }
    </>
  )
}

export default DatePicker;
