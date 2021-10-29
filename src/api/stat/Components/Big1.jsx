
import React, { Component } from 'react';
import loadable from '@loadable/component';
const Story = loadable(() => import('./Components/Big1'));
const MostStories = loadable(() => import('./Components/Big1'));
const StoryScore = loadable(() => import('./Components/Big1'));
const Donwload = loadable(() => import('./Components/Big1'));
const MostUser = loadable(() => import('./Components/Big1'));
import { Segment } from 'semantic-ui-react';

const Big1 = ({id}) => {
    
    return (
    <>
    <section>
        <StoryComponent />
        <Segment id={id} className='componentFila' inverted>
            <MostStoriesComponent id={id} className='Columna1' inverted></MostStoriesComponent>
            <StoryScoreComponent id={id} className='Columna2' inverted ></StoryScoreComponent>
        </Segment>
        <Segment id={id}  className='componentFila' inverted>
            <DonwloadComponent id={id}  className='Columna1' inverted></DonwloadComponent>
            <MostUserComponent id={id}  className='Columna2' inverted ></MostUserComponent>
        </Segment>
    </section>
</>
)};


export default Big1;