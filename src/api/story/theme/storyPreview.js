import React, {Component} from 'react';
import {
  Segment,
  Image,
  Header,
    Icon,
    List,
    Button,
} from 'semantic-ui-react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

export default class storyPreview extends Component {
    constructor(props) {
      super(props);
      this.state = {
        device: 'mobile', // tablet
        disposition: 'vertical', // horizontal
        loading: false,
        story: this.props.story,
        theme: this.props.theme,
        server: this.props.server,
        styleSheet: {
          wrap:{
            display:'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          },
            mobileContainer: {
            color: '#FFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            width: 375,
            height: 667,
          },
          deviceOption: {
            display: 'flex',
            background: "transparent",
            paddingRight: 20,
          },
          mobileHeader: {
            display:'flex',
            background: '#ccc',
            display: 'flex',
            justifyContent: 'space-around',
            alignSelf: 'stretch',
            flexGrow: 1,
            padding: 20,
            margin: 0,
            },
          logo: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            alignContent: 'center',
            flexGrow: 1,
            },
          tile: {
            background: 'transparent url('+ this.props.server+this.props.theme.banner.path+') no-repeat top left',
            backgroundSize: 'cover',
            display: 'flex',
            alignSelf: 'stretch',
            flexGrow: 1,
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
            margin: 0,
            marginBottom: 3,
          },
          tileTitle: {
            display: 'flex',
            alignSelf: 'stretch',
            justifyContent: 'center',
            flexGrow: 1,
            fontFamily: this.props.theme.font1,
            color: '#fff',
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: 0, height: 1},
            textShadowRadius: 10,
            margin: 0,
            padding: 0,
          },
          tileSubtitle: {
            display: 'flex',
            alignSelf: 'stretch',
            justifyContent: 'center',
            flexGrow: 1,
            color: '#fff',
            fontFamily: this.props.theme.font2,
            textShadowColor: 'rgba(0, 0, 0, 0.75)',
            textShadowOffset: {width: -1, height: 1},
            textShadowRadius: 10,
            margin: 0,
            padding: 0,
            fontSize: 14,
          },
          card:{
            display: 'flex',
            flexDirection: 'column',
            alignContent: 'stretch',
            overflow: 'scroll',
            height: 540,
          },
          sinopsys:{
            background: '#fff',
            color: '#000',
            padding: '40px',
            fontFamily: this.props.theme.font2,
          },
          credits:{
            background: this.props.theme.color1,
            color: this.props.theme.color3,
            padding: '40px',
            fontFamily: this.props.theme.font3,
          },
          gallery:{
            background: this.props.theme.color3,
            display: 'flex',
          },
          titleCredits:{
            color: this.props.theme.color3,
            textTransform:'uppercase',
            fontSize: '20px'
          },
          nav:{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-around',
            alignItems: 'stretch',
            background: this.props.theme.color2,
            padding: 20,
            color: this.props.theme.color1,
          },
          menu:{
            display: 'flex',
            flexDirection: 'row',
          },
          message:{

          },
          transport: {
            display: 'flex',
            flexDirection: 'row',
            fontSize: 12,
            backgroundColor: '#4B4F53',
            borderWidth: 0,
            borderColor: '#d2d2d2',
            minHeight: 40,
            maxHeight: 40,
            margin: 0,
          },
        }
      }
    }
    render() {
    const {styleSheet, device, disposition, loading} = this.state;
    return (

      <div style={styleSheet.wrap} >
        <div style={styleSheet.deviceOption}>
        <Button.Group vertical >
          <Button secondary icon>
            <Icon name='undo alternate' />
          </Button>
          <Button secondary icon>
            <Icon name='tablet alternate' />
          </Button>
        </Button.Group>
        </div>
        <div style={styleSheet.mobileContainer}>
          <Header style={styleSheet.mobileHeader}>
              <Icon name="bars"/>
              <Icon style={styleSheet.logo} name="b"/>
          </Header>
          <div style={styleSheet.tile}>
            <h1 style={styleSheet.tileTitle}>{this.state.story.title}</h1>
            <h2 style={styleSheet.tileSubtitle}>{this.state.story.city} - {this.state.story.state}</h2>
          </div>
          <div style={styleSheet.card} >
             <div  style={styleSheet.sinopsys}>
                { ReactHtmlParser(this.state.story.sinopsys) }
              </div>
              <div style={styleSheet.credits}>
               <h1 style={styleSheet.titleCredits}>Credits</h1>
                { ReactHtmlParser(this.state.story.credits) }
              </div>
          </div>
          <div style={styleSheet.nav} >
              <div style={styleSheet.message}> Please choose your mode of transportation and press Start Navigation.</div>
              <div style={styleSheet.transport} >
                <Button>Caminando</Button>
                <Button>Auto</Button>
                <Button>En bici</Button>
              </div >
              <div style={styleSheet.menu} >
                  <Button><Icon  name='trash'  /></Button>
                  <Button><Icon  name='play'  /></Button>
                  <Button><Icon  name='point'  /></Button>
              </div >
           </div>
        </div>
      </div>
    )
  }
}
