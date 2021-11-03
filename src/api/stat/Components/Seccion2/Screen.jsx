import React, { useState } from 'react'
import { Table, Segment, Button, Icon, Secction } from 'semantic-ui-react';
import loadable from '@loadable/component';
const GrafDevice = loadable(() => import('./GrafDevice'));

const Layout = ({ title, children, handleDisplay, id}) => {
    return (
        <secction inverted style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: '#232323' }}>
            <secction id={id} className='headerStories' inverted>
                <Segment id={id} className='titleStories' inverted>
                    {title}
                </Segment>
                <Segment id={id} className='buttons' inverted>
                    <Button id={id} className='bLeft' icon inverted><Icon name='angle up' /></Button>
                    <Button id={id} className='bRigth' icon inverted ><Icon name='angle down' /></Button>
                </Segment>
            </secction>
            {children}
            <Segment id={id} className='botones' inverted >
                <Button id={id} className='bRigth' onClick={() => handleDisplay('list')} inverted>LIST</Button>
                <Button id={id} className='bLeft' onClick={() => handleDisplay('chart')} inverted>CHART</Button>
            </Segment>
        </secction>
    )
}
const Screen = ({ id }) => {
    const [display, setDisplay] = useState('list');
    const handleDisplay = (display) => setDisplay(display);
    return (
        <>
            <layout id={id} title='BY OPERATIVE SYSTEM' handleDisplay={handleDisplay}>
                {display === 'list' &&
                    <Table striped id={id} className='tableStories' inverted>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell>1 - 2000</Table.Cell>
                                <Table.Cell>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, obcaecati?
                                </Table.Cell>
                            </Table.Row>
                            <Table.Row>
                                <Table.Cell>1 - 2000</Table.Cell>
                                <Table.Cell>
                                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, obcaecati?
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                }
                {display === 'chart' &&
                    <GrafDevice />
                }

            </layout>


        </>
    )

};

export default Screen && Layout;