import React, { Component } from 'react'
import { Table, Segment, Button, Icon } from 'semantic-ui-react';

const MostStories = ({ id }) => {
    <>
        <secction inverted style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: '#232323' }}>
            <secction id={id} className='headerStories' inverted>
                <Segment id={id} className='titleStories' inverted>
                    MOST COMPLETED STORIES
                </Segment>
                <Segment id={id} className='buttons' inverted>
                    <Button id={id} className='bLeft' icon inverted><Icon name='angle up' /></Button>
                    <Button id={id} className='bRigth' icon inverted><Icon name='angle down' /></Button>
                </Segment>
            </secction>
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
            <Segment id={id} className='botones' inverted>
                <Button id={id} className='bRigth bmargen' inverted>LIST</Button>
                <Button id={id} className='bLeft bmargen' inverted>CHART</Button>
            </Segment>
        </secction>
    </>
}

export default MostStories;
