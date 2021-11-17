
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
                    <MostStories className='tablas' />
                    <StoryScore className='tablas' />
                </Segment>
                <Segment inverted className='tablaGeneral'>
                    <Donwload className='tablas' />
                    <MostUser className='tablas' />
                </Segment>
            </secction>

            {/* <section>
                <Story />
                <Segment id={id} className='componentFila' inverted>
                    <MostStories id={id} className='Columna1' inverted></MostStories>
                    <StoryScore id={id} className='Columna2' inverted ></StoryScore>
                </Segment>
                <Segment id={id} className='componentFila' inverted>
                    <Donwload id={id} className='Columna1' inverted></Donwload>
                    <MostUser id={id} className='Columna2' inverted ></MostUser>
                </Segment>
            </section> */}
        </>
    )
};


export default Big1;