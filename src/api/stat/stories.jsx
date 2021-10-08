import React, { useContext, useState, useEffect, createContext } from 'react';
import { Segment, Label,Dimmer, Loader } from 'semantic-ui-react';
import loadable from '@loadable/component';

const Stories = () => {
  return (
    <Segment inverted style={{height: '90vh'}}>Tab Stories content</Segment>
  )
}

export default Stories;
