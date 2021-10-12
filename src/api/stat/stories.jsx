import React, { useContext, useState, useEffect, createContext } from 'react';
import { Segment, Label,Dimmer, Loader, Menu} from 'semantic-ui-react';
import Helmet from 'react-helmet';
import loadable from '@loadable/component';

const Stories = () => {
  return (
    <>
    <Helmet>
        <style>{`
          #stories .titleStories, .ui.segment{
            border-style: solid !important;
            border-width: 0px 0px 2px 0px !important;
            border-color: #2B2B2B !important;
          }
          `}</style>
    </Helmet>
      <Segment id='stories' className='TitleStories' inverted style={{background: 'transparent', color: '#666'}}>

        All stories comments
      </Segment>
        <Segment inverted style={{height: '90vh'}}>Tab Stories content</Segment>
    </>
  )
}

export default Stories;

