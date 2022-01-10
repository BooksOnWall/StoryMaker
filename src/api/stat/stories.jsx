import React from 'react';
import { Segment } from 'semantic-ui-react';
import loadable from '@loadable/component';
const Big1 = loadable(() => import('./Components/Big1'));
const Big2 = loadable(() => import('./Components/Big2'));

const Stories = () => {
  return (
    <>
        <Segment id='stories' className='componentPadre' inverted >
          <Big2 />
          <Big1  />
        </Segment>
    </>
  )

}

export default Stories;
