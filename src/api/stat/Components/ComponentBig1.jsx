
import React, { Component } from 'react'
import StoryComponent from './ComponentsSeccion1/StoryComponent';
import MostStoriesComponent from './ComponentsSeccion1/MostStoriesComponent';
import StoryScoreComponent from './ComponentsSeccion1/StoryScoreComponent';
import DonwloadComponent from './ComponentsSeccion1/DonwloadComponent';
import MostUserComponent from './ComponentsSeccion1/MostUserComponent';

class ComponentBig1 extends Component {
    render() {
        return (
            <>
                <section>
                    <StoryComponent />
                    <div inverted style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', width: '40%' }}>
                        <MostStoriesComponent inverted style={{ display: 'flex', flex: 1 }}></MostStoriesComponent>
                        <StoryScoreComponent inverted style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}></StoryScoreComponent>
                    </div>
                    <div inverted style={{ display: 'flex', flex: 1, justifyContent: 'space-between', alignItems: 'flex-start', width: '40%' }}>
                        <DonwloadComponent inverted style={{ display: 'flex', flex: 1 }}></DonwloadComponent>
                        <MostUserComponent inverted style={{ display: 'flex', flex: 1, justifyContent: 'flex-end' }}></MostUserComponent>
                    </div>
                </section>
            </>
        )
    }
}

export default ComponentBig1;