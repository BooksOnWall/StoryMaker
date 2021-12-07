import React, { } from 'react';
import { Segment, Header, Table, Form } from 'semantic-ui-react';
import loadable from '@loadable/component';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
const GraficaGeneral = loadable(() => import('./Components/GraficaGeneral'));
const Barras = loadable(() => import('./Components/Barras'));
const Story = loadable(() => import('./Components/Seccion1/Story'));
const MostUser2 = loadable(() => import('./Components/MostUser2'));
const LastScore = loadable(() => import('./Components/LastScore'));
const TimeByStage = loadable(() => import('./Components/TimeByStage'));
const MostUserDevice = loadable(() => import('./Components/MostUserDevice'));
const General = () => {
  return (
    <secction className='secctionGeneral'>
      {/* FORMULARIO DE CUENTOS */}
      <secction className='secctionBooks'>
        <Segment inverted className='headerBooks'>
          <Header className='textHeaderBooks' as='h3'>STORIES</Header>
        </Segment>
        <Segment inverted className='TableBooks'>
          <MenuList>
            <MenuItem selected={true}>Silencio Barbaro</MenuItem>
            <MenuItem>Los Cantos Rodados</MenuItem>
            <MenuItem>USB Test</MenuItem>
            <MenuItem>Salto Prueba</MenuItem>
            <MenuItem>NMEC</MenuItem>
            <MenuItem>Doris Caravan</MenuItem>
          </MenuList>
        </Segment>
      </secction>
      {/* GRAFICAS */}
      <secction className='flexdirecction'>
        <secction className='secctionGrafics'>
          <Segment inverted>
            <secction id='stories' className='containerHeader'>
              <Segment inverted id='stories' className='appInstalled'>
                <Header className='titleGrafica' as='h5'>APP INSTALLED</Header>
              </Segment>
              <Segment inverted id='stories' className='total'>
                <Header className='titleGrafica' as='h5'>TOTAL <a>3000</a></Header>
              </Segment>
            </secction>
            <GraficaGeneral />
            <secction id='stories' className='containerHeader'>
              <Segment inverted id='stories' className='appInstalled'>
                <Header className='titleGrafica' as='h5'>APP INSTALLED</Header>
              </Segment>
              <Segment inverted id='stories' className='total'>
                <Header className='titleGrafica' as='h5'>TOTAL <a>3000</a></Header>
              </Segment>
            </secction>
            <GraficaGeneral />
            <Barras />
          </Segment>
        </secction>
        {/* TABLAS */}
        <secction className='secctionTables'>
          <Segment inverted>
            <Story />
          </Segment>
          <Segment inverted className='tablaGeneral'>
            <LastScore />
            <MostUser2 />
            <TimeByStage />
            <MostUserDevice />
          </Segment>
        </secction>
      </secction>
    </secction>
  )
}


export default General;
