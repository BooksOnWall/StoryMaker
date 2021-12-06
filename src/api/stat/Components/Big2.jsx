import React from 'react';
import { Segment, Header } from 'semantic-ui-react';
import loadable from '@loadable/component';
const Device = loadable(() => import('./Seccion2/Device'));
const Grafica = loadable(() => import('./Seccion2/Grafica'));
const Operative = loadable(() => import('./Seccion2/Operative'));
const Ram = loadable(() => import('./Seccion2/Ram'));
const Screen = loadable(() => import('./Seccion2/Screen'));
const Support = loadable(() => import('./Seccion2/Support'));

const Big2 = ({ id }) => {
    return (
        <>
            <secction className='secctionTablesB2'>
                <Segment inverted>
                    <secction className='marginGrafica'>
                        <secction id={id} className='containerHeader'>
                            <Segment inverted id={id} className='appInstalled'>
                                <Header className='titleGrafica' as='h5'>APP INSTALLED</Header>
                            </Segment>
                            <Segment inverted id={id} className='total'>
                            <Header className='titleGrafica' as='h5'>TOTAL <a>3000</a></Header>
                            </Segment>
                        </secction>
                        <Segment id={id} className='grafico'>
                            <Grafica id={id} className='grafico' />
                        </Segment>
                    </secction>
                </Segment>
                <Segment inverted className='tablaGeneral'>
                    <Operative className='tablas2' />
                    <Device className='tablas2' />
                    <Support className='tablas2' />
                    <Ram className='tablas2' />
                    <Screen className='tablas2' />
                    <Screen className='tablas2' />
                </Segment>
            </secction>
        </>
    )

}
export default Big2;