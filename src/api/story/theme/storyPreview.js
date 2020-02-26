import React, {Component} from 'react';
import {
  Segment,
  Image,
  Header,
    Icon,
    List,
} from 'semantic-ui-react';

export default class storyPreview extends Component {
    constructor(props) {
      super(props);
      this.state = {
        device: 'mobile', // tablet
        disposition: 'vertical', // horizontal
        loading: false,
        styleSheet: {
          mobileContainer: {
            color: '#FFF',
            backgroundColor: '#FFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            height: '1024px',
            widht: '720px',
          },
          tile: {
            background: '#f1f1f1 url('+props.server+props.theme.banner.path+') no-repeat center center',
            backgroundSize: 'cover',
            display: 'flex',
            flexDirection: 'column',
          },
          tileTitle: {
            display: 'flex',
            fontFamily: props.theme.font1,
            color: props.theme.color1,
          },
          tileSubtitle: {
            display: 'flex',
            fontFamily: props.theme.font2,
          },
          mobileHeader:{
            background: '#ccc',
            display: 'flex',
          },
          sinopsys:{
            background: '#fff',
            color: props.color2,
          },
          credits:{
            background: props.theme.color1,
            color: props.color3,
            padding: '40px',
          },
          gallery:{
            background: '#000',
            display: 'flex',
          },
          nav:{
            display: 'flex',
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'stretch',
            background: '#ccc',
          },
        }
      }
    }
    render() {
    const {styleSheet, device, disposition, loading} = this.state;
    return (
      <div className="mobile" style={styleSheet.mobileContainer}>
        <Header  style={styleSheet.mobileHeader}>
            <Icon name="home"/>
            <Icon name="lock"/>
        </Header>
        <Segment>
            <div style={styleSheet.tile}>
                <h1 style={styleSheet.tileTitle}>{ ReactHtmlParser(this.state.story.title) }</h1>
                <h2 style={styleSheet.tileSubtitle}>{ ReactHtmlParser(this.state.story.city) }</h2>
             </div>
             <div  style={styleSheet.sinopsys}>
                { ReactHtmlParser(this.state.story.sinopsys) }
              </div>
              <div style={styleSheet.gallery}>

              </div>
              <div style={styleSheet.credits}>
                { ReactHtmlParser(this.state.story.credits) }
              </div>
          </Segment>
          <div style={styleSheet.nav} >
                <div>
                    <Icon  name='trash'  />
                </div>
                <div>
                    <Icon  name='play'  />
                </div>
                <div>
                    <Icon  name='point'  />
                </div>
         </div>
      </div>
    )
  }
}
