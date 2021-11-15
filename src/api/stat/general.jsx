import React, { } from 'react';
import { Segment, Header, Table } from 'semantic-ui-react';
import loadable from '@loadable/component';
const GraficaGeneral = loadable(() => import('./Components/GraficaGeneral'));

const General = () => {
  return (
    <secction className='secctionGeneral'>
      <secction className='secctionBooks'>
        <Segment inverted className='headerBooks'>
          <Header className='textHeaderBooks' as='h3'>STORIES</Header>
        </Segment>
        <Segment inverted className='TableBooks'>
          <Table singleLine inverted className='borderTableBooks'>
            <Table.Body>
              <Table.Row>
                <Table.Cell>
                  <Segment inverted className='buttonBooks' />
                </Table.Cell>
                <Table.Cell>
                  <Segment inverted className='headerBooks'>
                    <Header className='textHeaderBooks' as='h5'>Fifth Header</Header>
                  </Segment>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Segment inverted className='buttonBooks' />
                </Table.Cell>
                <Table.Cell>
                  <Segment inverted className='headerBooks'>
                    <Header className='textHeaderBooks' as='h5'>Fifth Header</Header>
                  </Segment>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Segment inverted className='buttonBooks' />
                </Table.Cell>
                <Table.Cell>
                  <Segment inverted className='headerBooks'>
                    <Header className='textHeaderBooks' as='h5'>Fifth Header</Header>
                  </Segment>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Segment inverted className='buttonBooks' />
                </Table.Cell>
                <Table.Cell>
                  <Segment inverted className='headerBooks'>
                    <Header className='textHeaderBooks' as='h5'>Fifth Header</Header>
                  </Segment>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Segment inverted className='buttonBooks' />
                </Table.Cell>
                <Table.Cell>
                  <Segment inverted className='headerBooks'>
                    <Header className='textHeaderBooks' as='h5'>Fifth Header</Header>
                  </Segment>
                </Table.Cell>
              </Table.Row>
              <Table.Row>
                <Table.Cell>
                  <Segment inverted className='buttonBooks' />
                </Table.Cell>
                <Table.Cell>
                  <Segment inverted className='headerBooks'>
                    <Header className='textHeaderBooks' as='h5'>Fifth Header</Header>
                  </Segment>
                </Table.Cell>
              </Table.Row>
            </Table.Body>
          </Table>
        </Segment>
      </secction>
      <secction className='secctionGrafics'>
        <Segment inverted>
          <GraficaGeneral />
        </Segment>
      </secction>
      <secction className='secctionTables'>
        <h1>Seccion 3</h1>
      </secction>
    </secction>
  )
}


export default General;







// import React, { useContext, useState, useEffect, createContext } from 'react';
// import { Segment, Label,Dimmer, Loader } from 'semantic-ui-react';
// import loadable from '@loadable/component';
// import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// const data = [
//   {
//     name: 'Page A',
//     uv: 4000,
//     pv: 2400,
//     amt: 2400,
//   },
//   {
//     name: 'Page B',
//     uv: 3000,
//     pv: 1398,
//     amt: 2210,
//   },
//   {
//     name: 'Page C',
//     uv: 2000,
//     pv: 9800,
//     amt: 2290,
//   },
//   {
//     name: 'Page D',
//     uv: 2780,
//     pv: 3908,
//     amt: 2000,
//   },
//   {
//     name: 'Page E',
//     uv: 1890,
//     pv: 4800,
//     amt: 2181,
//   },
//   {
//     name: 'Page F',
//     uv: 2390,
//     pv: 3800,
//     amt: 2500,
//   },
//   {
//     name: 'Page G',
//     uv: 3490,
//     pv: 4300,
//     amt: 2100,
//   },
// ];


// const General = () => {
//   return (
//     <Segment inverted style={{height: '90vh'}}>
//     <ResponsiveContainer width="100%" height="100%">
//        <LineChart
//          width={500}
//          height={300}
//          data={data}
//          margin={{
//            top: 5,
//            right: 30,
//            left: 20,
//            bottom: 5,
//          }}
//        >
//          <CartesianGrid strokeDasharray="3 3" />
//          <XAxis dataKey="name" />
//          <YAxis />
//          <Tooltip />
//          <Legend />
//          <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{ r: 8 }} />
//          <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
//        </LineChart>
//      </ResponsiveContainer>
//     </Segment>
//   )
// }

// export default General;
