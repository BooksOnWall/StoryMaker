import React, { Component } from 'react';
import { Segment } from 'semantic-ui-react';
import loadable from '@loadable/component';
const Device = loadable(() => import('./Components/Big2'));
const Grafica = loadable(() => import('./Components/Big2'));
const Operative = loadable(() => import('./Components/Big2'));
const Ram = loadable(() => import('./Components/Big2'));
const Screen = loadable(() => import('./Components/Big2'));
const Support = loadable(() => import('./Components/Big2'));


const Big2 = ({ id }) => {
    <>
        <secction>
            <Segment id={id} className='grafico'>
                <Grafica id={id} className='grafico' />
            </Segment>
            <Segment id={id} className='padreStories' inverted>
                <DeviceComponent id={id} className='listStories' />
                <OperativeComponent id={id} className='listStories' />
                <SupportComponent id={id} className='listStories' />

            </Segment>
            <Segment id={id} className='padreStories' inverted>
                <RamComponent id={id} className='listStories' />
                <ScreenComponent id={id} className='listStorie' />
            </Segment>

        </secction>

    </>
}
export default ComponentBig2;