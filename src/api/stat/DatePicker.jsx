import React, { useContext, useState, useEffect, createContext } from 'react';
import { Menu, Segment, Label,Dimmer, Loader } from 'semantic-ui-react';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import Helmet from 'react-helmet';

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
        <Menu.Item style={{fontSize: 18}}  ><p id='stat' className='startAt'>Start at:</p> dd/mm/yy</Menu.Item>
        <Menu.Item style={{fontSize: 18}}  ><p id='stat' className='startAt'>End at at:</p> dd/mm/yy</Menu.Item>
        </>
      }
    </>
  )
}

export default DatePicker;
