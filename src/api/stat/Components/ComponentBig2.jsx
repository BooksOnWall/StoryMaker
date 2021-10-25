import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import DeviceComponent from './ComonentsSeccion2/DeviceComponent';
import OperativeComponent from './ComonentsSeccion2/OperativeComponent';
import RamComponent from './ComonentsSeccion2/RamComponent';
import ScreenComponent from './ComonentsSeccion2/ScreenComponent';
import SupportComponent from './ComonentsSeccion2/SupportComponent';

class ComponentBig2 extends Component {
    render() {
        return (
            <>
                <secction>
                    <Segment id='stories' className='padreStories' inverted>
                        <DeviceComponent id='stories' className='listStories' />
                        <OperativeComponent id='stories' className='listStories' />
                        <SupportComponent id='stories' className='listStories' />
                        
                    </Segment>
                    <Segment id='stories' className='padreStories' inverted>
                        <RamComponent id='stories' className='listStories' />
                        <ScreenComponent id='stories' className='listStories' />
                    </Segment>

                </secction>

            </>

        )
    }
}

export default ComponentBig2;