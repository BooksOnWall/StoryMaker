import React, { Component, useState } from 'react'
import { Table, Segment, Button, Icon, Secction } from 'semantic-ui-react';
import loadable from '@loadable/component';
const GrafDevice = loadable(() => import('./Seccion2/GrafDevice'));
const Layout2 = loadable(() => import('./Layout2'));


const MostUser2 = ({ id }) => {
    const [display, setDisplay] = useState('list');
    const handleDisplay = (display) => setDisplay(display);
    return (
        <>
            <Layout2 id='stories' title='MOST USER BY CITY' handleDisplay={handleDisplay}>
                {display === 'list' &&
                    <Segment inverted className='alturaTable'>
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
                                <Table.Row>
                                    <Table.Cell>1 - 2000</Table.Cell>
                                    <Table.Cell>
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, obcaecati?
                                    </Table.Cell>
                                </Table.Row>
                            </Table.Body>
                        </Table>
                    </Segment>

                }
                {display === 'chart' &&
                    <GrafDevice />
                }

            </Layout2>


        </>
    )

};

export default MostUser2;
