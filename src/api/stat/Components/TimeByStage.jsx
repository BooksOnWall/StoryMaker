import React, { useState } from 'react'
import { Table, Segment, Button, Icon, Secction } from 'semantic-ui-react';
import loadable from '@loadable/component';
const GrafDevice = loadable(() => import('./Seccion2/GrafDevice'));
const Layout = loadable(() => import('./Seccion2/Layout'));


const TimeByStage = () => {
    const [display, setDisplay] = useState('list');
    const handleDisplay = (display) => setDisplay(display);
    return (
        <>
            <Layout id='stories' title='TIME BY STAGE' handleDisplay={handleDisplay}>
                {display === 'list' &&
                    <Table striped id='stories' className='tableStories' inverted>
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

            </Layout>


        </>
    )

};

export default TimeByStage;  
