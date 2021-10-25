import React, { Component } from 'react'
import { Table, Segment, Button, Icon, Secction } from 'semantic-ui-react';
import loadable from '@loadable/component';
import Helmet from 'react-helmet';

class DeviceComponent extends Component {
    render() {
        return (
            <>
                <secction inverted style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: '#232323' }}>
                    <secction id='stories' className='headerStories' inverted>
                        <Segment id='stories' className='titleStories' inverted>
                            BY OPERATIVE SYSTEM
                        </Segment>
                        <Segment id='stories' className='buttons' inverted>
                            <Button id='stories' className='bLeft' icon inverted><Icon name='angle up' /></Button>
                            <Button id='stories' className='bRigth' icon inverted ><Icon name='angle down' /></Button>
                        </Segment>
                    </secction>
                    <Table id='stories' className='tableStories' inverted>
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
                    <Segment id='stories' className='botones' inverted >
                        <Button id='stories' className='bRigth' inverted>LIST</Button>
                        <Button id='stories' className='bLeft' inverted>CHART</Button>
                    </Segment>
                </secction>
            </>
        )
    }
}

export default DeviceComponent;