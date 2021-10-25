import React from 'react';
import { Segment } from 'semantic-ui-react';
import ComponentBig1 from './Components/ComponentBig1';
import ComponentBig2 from './Components/ComponentBig2'

const Stories = () => {
  return (
    <>
      <Segment id='stories' className='componentPadre' inverted >
        <ComponentBig1 id='stories' className='component1' />
        <ComponentBig2 id='stories' className='compoenent2' />
      </Segment>

    </>
  )

}

export default Stories;

