import React, { Component } from 'react'
import { Table, Segment, Button, Icon, Secction } from 'semantic-ui-react';
import loadable from '@loadable/component';
import Helmet from 'react-helmet';

class MostStoriesComponent extends Component {
    render() {
        return (
            <>
                <secction inverted style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: '#232323' }}>
                    <secction id='stories' className='headerStories' inverted style={{
                        display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start',
                        paddingTop: '5px', paddingButton: '5px'
                    }}>
                        <Segment id='stories' className='TitleStories' inverted style={{ display: 'flex', color: '#6C6C6C', flex: '1 1 %50', padding: '8px', marginBottom: '0px' }}>
                            MOST COMPLETED STORIES
                        </Segment>
                        <Segment id='stories' className='buttons' inverted style={{ display: 'flex', flex: '0 1 0', justifyContent: 'flex-end', marginTop: '0px', padding: '0px'}}>
                            <Button icon inverted style={{boxShadow: '0px 0px 0px 0px inset !important', }}><Icon name='angle up' /></Button>
                            <Button icon inverted style={{}}><Icon name='angle down' /></Button>
                        </Segment>
                    </secction>
                    <Table inverted style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: '#232323' }}>
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
                    <div id='stories' className='buttons' inverted style={{ padding: '1rem' }}>
                        <Button inverted style={{ background: '#323232', boxShadow: '0px 0px 0px 0px inset !important' }}>LIST</Button>
                        <Button inverted style={{ background: '#202020' }}>CHART</Button>
                    </div>
                </secction>
            </>
        )
    }
}

export default MostStoriesComponent;
