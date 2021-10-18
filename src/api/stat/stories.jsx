import React from 'react';
import StoryComponent from './Components/StoryComponent';
import MostStoriesComponent from './Components/MostStoriesComponent';
import StoryScoreComponent from './Components/StoryScoreComponent';
import DonwloadComponent from './Components/DonwloadComponent';
import MostUserComponent from './Components/MostUserComponent';


const Stories = () => {
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

export default Stories;

