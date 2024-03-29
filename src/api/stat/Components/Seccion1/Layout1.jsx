import React from 'react'
import { Segment, Button, Icon, Header } from 'semantic-ui-react';

const Layout1 = ({id, title, children, handleDisplay }) => {
    return (
        <secction inverted className='layout1' style={{ borderStyle: 'solid', borderWidth: '1px', borderColor: '#232323' }}>
        <secction id={id} className='headerStories' inverted>
            <Segment id={id} className='titleStories' inverted>
            <Header as='h5'>{title}</Header>
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

export default Layout1