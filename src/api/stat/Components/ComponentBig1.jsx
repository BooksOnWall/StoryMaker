
import React, { Component } from 'react'
import StoryComponent from './ComponentsSeccion1/StoryComponent';
import MostStoriesComponent from './ComponentsSeccion1/MostStoriesComponent';
import StoryScoreComponent from './ComponentsSeccion1/StoryScoreComponent';
import DonwloadComponent from './ComponentsSeccion1/DonwloadComponent';
import MostUserComponent from './ComponentsSeccion1/MostUserComponent';
import { Segment } from 'semantic-ui-react';

class ComponentBig1 extends Component {
    render() {
        return (
            <>
                <section>
                    <StoryComponent />
                    <Segment id='stories' className='componentFila' inverted>
                        <MostStoriesComponent id='stories' className='Columna1' inverted></MostStoriesComponent>
                        <StoryScoreComponent id='stories' className='Columna2' inverted ></StoryScoreComponent>
                    </Segment>
                    <Segment id='stories' className='componentFila' inverted>
                        <DonwloadComponent id='stories' className='Columna1' inverted></DonwloadComponent>
                        <MostUserComponent id='stories' className='Columna2' inverted ></MostUserComponent>
                    </Segment>
                </section>
            </>
        )
    }
}

export default ComponentBig1;