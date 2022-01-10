import React, { Component, useState } from 'react'
import { Table, Segment, Button, Icon, Secction } from 'semantic-ui-react';
import loadable from '@loadable/component';
const GrafDevice = loadable(() => import('./GrafDevice'));
const Layout = loadable(() => import('./Layout'));


const Ram = ({ id }) => {
    const [display, setDisplay] = useState('list');
    const handleDisplay = (display) => setDisplay(display);
    return (
        <>
            <Layout id='stories' title='BY RAM' handleDisplay={handleDisplay}>
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

            </Layout>


        </>
    )

};

export default Ram;
