import React, { Component } from 'react'
import { Table, Segment, Button, Icon } from 'semantic-ui-react';

class DonwloadComponent extends Component {
    render() {
        return (
            <div inverted style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: '#232323' }}>
                <div id='stories' className='headerStories' inverted style={{
                    display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start',
                    paddingTop: '5px', paddingButton: '5px'
                }}>
                    <div id='stories' className='TitleStories' inverted style={{ display: 'flex', color: '#6C6C6C', flex: 1, padding: '8px' }}>
                        MOST DONWLOAD STORIES
                    </div>
                    <div id='stories' className='buttons' inverted style={{ display: 'flex', flex: '1 1 %50', justifyContent: 'flex-end' }}>
                        <Button icon inverted style={{ background: '#323232', boxShadow: '0px 0px 0px 0px inset !important' }}><Icon name='angle up' /></Button>
                        <Button icon inverted style={{ background: '#202020' }}><Icon name='angle down' /></Button>
                    </div>
                </div>
                <Table inverted style={{ borderStyle: 'solid', borderWidth: '2px', borderColor: '#232323' }}>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>1 - 2000</Table.Cell>
                            <Table.Cell>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, obcaecati?
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>2 - 1000</Table.Cell>
                            <Table.Cell>
                                Lorem ipsum dolor sit amet consectetur adipisicing elit. Doloremque, obcaecati?
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
                <div id='stories' className='buttons' inverted style={{ padding: '1rem' }}>
                    <Button  inverted style={{ background: '#323232', boxShadow: '0px 0px 0px 0px inset !important' }}>LIST</Button>
                    <Button  inverted style={{ background: '#202020' }}>CHART</Button>
                </div>
            </div>
        )
    }
}

export default DonwloadComponent;