import React, { Component } from 'react'
import { Table, Segment, Button, Icon } from 'semantic-ui-react';
import loadable from '@loadable/component';
import Helmet from 'react-helmet';

class StoryComponent extends Component {
    render() {
        return (
            <>

                <secction id='stories' className='headerStories' inverted style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', width: '40%' }}>
                    <Segment id='stories' className='TitleStories' inverted style={{ display: 'flex', color: '#6C6C6C', flex: 1, marginBottom: '0px' }}>
                        ALL STORIES COMMENTS
                    </Segment>
                    <Segment id='stories' className='buttons' inverted style={{ padding: '1rem', display: 'flex', flex: '0 1 0', marginTop: '0px' }}>
                        <Button icon inverted style={{ background: '#323232', boxShadow: '0px 0px 0px 0px inset !important' }}><Icon name='angle up' /></Button>
                        <Button icon inverted style={{ background: '#202020' }}><Icon name='angle down' /></Button>
                    </Segment>
                </secction>

                <Table striped inverted style={{ width: '40%', borderStyle: 'solid', borderWidth: '2px', borderColor: '#232323' }}>
                    <Table.Body>
                        <Table.Row>
                            <Table.Cell>2/10</Table.Cell>
                            <Table.Cell>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae facere eligendi autem necessitatibus placeat beatae ipsam voluptatum vero provident similique.
                                <p inverted style={{ color: '#666', marginTop: '1rem' }}>Story Name</p>
                            </Table.Cell>
                        </Table.Row>
                        <Table.Row>
                            <Table.Cell>2/10</Table.Cell>
                            <Table.Cell>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae facere eligendi autem necessitatibus placeat beatae ipsam voluptatum vero provident similique.
                                <p inverted style={{ color: '#666', marginTop: '1rem' }}>Story Name</p>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </>
        )
    }
}


export default StoryComponent;
