import React, { useContext, useState, useEffect, createContext } from 'react';
import { Button, Segment, Label, Icon, Menu, Container, Dimmer, Loader, Tab  } from 'semantic-ui-react';
import loadable from '@loadable/component';
import Helmet from 'react-helmet';

const General = loadable(() => import('./general'));
const Stories = loadable(() => import('./stories'));
const DatePicker = loadable(() => import('./DatePicker'));

const CalendarMenu = ({period, handlePeriod, handlePrev, handleNext}) => (
  <>
    <Menu secondary inverted stackable style={{position: 'absolute', zIndex: 999, right: '0vw', width: '60vw'}}>
      <Menu.Menu position='right' style={{right: '0vw', width: '60vw', fontSize: 10, position: 'absolute', zIndex: 999}}>
        <Menu.Item><DatePicker period={period} /></Menu.Item>
        <Menu.Item
          onClick={(e) => handlePrev()}
        >
        <Icon name='arrow circle left' />
        </Menu.Item>
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
         <Menu.Item
           onClick={(e) => handleNext()}
         >
          <Icon name='arrow circle right' />
         </Menu.Item>

          </Menu.Menu>

       </Menu>
       </>
);
const Tabs = ({loading}) => {
  const panes = [
    {
      menuItem: 'General',
      render: () => <Tab.Pane style={{zIndex: '0 !important'}} inverted loading={loading}><General /></Tab.Pane>,
    },
    { menuItem: 'Stories',
      render: () => <Tab.Pane style={{zIndex: '0 !important'}} inverted loading={loading} ><Stories /></Tab.Pane>,
    },
  ];
  return (
    <>
    <Helmet>
        <style>{`
          .ui.attached.tabular.menu {
            z-index: 1;
            position: relative;
            padding: .1em;
            overflow: visible!important;
          }
          .ui.attached.tabular.menu .item {
            font-size: 1em;
            padding: .5em;
          }
          .ui.attached.tabular.menu .item.active {
            background-color: #000;
            border-color: #000;
          }
          `}</style>
      </Helmet>
    <Tab style={{zIndex: '0 !important'}} inverted  panes={panes} />
    </>
  )
}
const Stats = (props) => {
  const protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
  const domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
  const server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const authenticated = props.childProps.authenticated;
  const [period, setPeriod] = useState('month');
  const [min, setMin] = useState();
  const [max, setMax] = useState();
  const [startDate, setStartDate] = useState(new Date());

const StartDateInput = ({ value, onClick }) => (
  <Button basic onClick={onClick}>
    {value}
  </Button>
 );


  const slidePeriod = (direction) => {
    console.log(direction);
    return true;
  }
  const handlePeriod = (period) => setPeriod(period);
  const handlePrev = () => slidePeriod('prev');
  const handleNext = () => slidePeriod('next');

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
    listStats();

  }, [server]);

  return (

     <Container className="main" style={{ height: '100vh', overflow: 'auto'}} fluid>
      <Dimmer active={loading} inverted>
         <Loader disabled={!loading} inverted content='Loading' />
       </Dimmer>
       {!loading &&
         <>
          <CalendarMenu period={period} min={min} max={max} handlePeriod={handlePeriod} handleNext={handleNext} handlePrev={handlePrev}/>
          <Tabs style={{zIndex: '0 !important'}} loading={loading}/>
         </>
       }
     </Container>

  )
}
export default Stats;
