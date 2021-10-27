import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import DeviceComponent from './ComponentsSeccion2/DeviceComponent';
import Grafica from './ComponentsSeccion2/Grafica';
import OperativeComponent from './ComponentsSeccion2/OperativeComponent';
import RamComponent from './ComponentsSeccion2/RamComponent';
import ScreenComponent from './ComponentsSeccion2/ScreenComponent';
import SupportComponent from './ComponentsSeccion2/SupportComponent';

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
                    <Segment>
                        <grafica />
                    </Segment>

                </secction>

            </>

        )
    }
}

export default ComponentBig2;