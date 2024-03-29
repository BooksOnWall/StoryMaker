import React, { Component } from 'react'
import { Table, Segment, Button, Icon, Header } from 'semantic-ui-react';


const Story = ({ id }) => {
    return (
        <>
            <Segment id='stories' className='headerStories' inverted style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Segment id='stories' className='titleStories' inverted >
                    <Header as='h4'>ALL STORIES COMMENTS</Header>
                </Segment>
                <Segment id='stories' className='buttons' inverted>
                    <Button id={id} className='bLeft' icon inverted><Icon name='angle up' /></Button>
                    <Button id={id} className='bRigth' icon inverted><Icon name='angle down' /></Button>
                </Segment>
            </Segment>
            <Segment inverted className='alturaTableStory'>
                <Table striped inverted style={{ borderStyle: 'solid', borderWidth: '2px', borderColor: '#232323' }}>
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
                        <Table.Row>
                            <Table.Cell>2/10</Table.Cell>
                            <Table.Cell>
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Recusandae facere eligendi autem necessitatibus placeat beatae ipsam voluptatum vero provident similique.
                                <p inverted style={{ color: '#666', marginTop: '1rem' }}>Story Name</p>
                            </Table.Cell>
                        </Table.Row>
                    </Table.Body>
                </Table>
            </Segment>
        </>
    )

}


export default Story;
