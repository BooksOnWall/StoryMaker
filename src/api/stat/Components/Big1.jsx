
import React, { Component } from 'react';
import loadable from '@loadable/component';
import { Segment } from 'semantic-ui-react';
const Story = loadable(() => import('./Seccion1/Story'));
const MostStories = loadable(() => import('./Seccion1/MostStories'));
const StoryScore = loadable(() => import('./Seccion1/StoryScore'));
const Donwload = loadable(() => import('./Seccion1/Donwload'));
const MostUser = loadable(() => import('./Seccion1/MostUser'));


const Big1 = ({ id }) => {

    return (
        <>
            <secction className="secctionTablesB1">
                <Segment inverted>
                    <Story />
                </Segment>
                <Segment inverted className='tablaGeneral'>
                    <MostStories />
                    <StoryScore  />
                    <Donwload  />
                    <MostUser />
                </Segment>
            </secction>
        </>
    )
};


export default Big1;