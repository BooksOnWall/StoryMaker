import React, { useReducer, useState, useEffect , UseContext} from 'react';
import { Menu, Container, Dimmer, Loader, Tab  } from 'semantic-ui-react';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import CalendarContext from './componentsStat/calendar/calendar';
import { utimesSync } from 'fs';

export const CalendarContext = React.createContext()

export default function app() {
  const [maxDate, minDate] = useState(true)
}

  return (
    <Menu pointing secondary inverted >
      <Menu.Menu position='right'>
         <Menu.Item
           name='Day'
           active={period === 'day'}
           onClick={(e) => handlePeriod('day')}
         />
         <Menu.Item
           name='Week'
           active={period === 'week'}
           onClick={(e) => handlePeriod('week')}
         />
         <Menu.Item
           name='Month'
           active={period === 'month'}
            onClick={(e) => handlePeriod('month')}
         />
         <Menu.Item
           name='Year'
           active={period === 'year'}
            onClick={(e) => handlePeriod('year')}
         />
         <Menu.Item
           name='All'
           active={period === 'all'}
            onClick={(e) => handlePeriod('all')}
         />
          </Menu.Menu>
       </Menu>
  )
}
const Tabs = ({loading}) => {
  const panes = [
    {
      menuItem: 'General',
      render: () => <Tab.Pane inverted loading={loading}>Tab 1 Content</Tab.Pane>,
    },
    { menuItem: 'Stories', render: () => <Tab.Pane inverted loading={loading} >Tab 2 Content</Tab.Pane> },
  ];
  return (
    <Tab panes={panes} />
  )
}
const Stats = (props) => {
  const protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
  const domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
  const server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const authenticated = props.childProps.authenticated;
  const [period, setPeriod] = UseContext('day');
  const [min, setMin] = UseContext();
  const [max, setMax] = UseContext();
  const handlePeriod = (period) => setPeriod(period);

  useEffect(() => {
    const listStats = async () => {
      try {
        setLoading(true);
        await fetch(server+"stats", {
          method: 'get',
          headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
        })
        .then(response => {
          if (response && !response.ok) { throw new Error(response.statusText);}
          return response.json();
        })
        .then(data => {
            if(data) {
              setData(data.stats);
              setLoading(false)
            } else {
              console.log('No Data received from the server');
            }
        })
      } catch(e) {
        console.log(e.message);
      }
    };
    props.toggleAuthenticateStatus();
    //listStats();

  }, [props,server]);

  return (

     <Container className="main" style={{ height: '100vh', overflow: 'auto'}} fluid>
      <Dimmer active={loading} inverted>
         <Loader disabled={!loading} inverted content='Loading' />
       </Dimmer>
       {!loading &&
         <>
         <CalendarMenu period={period} min={min} max={max} handlePeriod={handlePeriod}/>
         <Tabs loading={loading}/>
         </>
       }
     </Container>

  )
}
export default Stats;
