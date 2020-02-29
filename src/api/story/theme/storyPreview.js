import React, {Component} from 'react';
import {
  Segment,
  Form,
  Image,
  Header,
  List,
  Icon,
  Modal,
  Select,
  Rail,
  Button,
} from 'semantic-ui-react';
import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';
import CustomIcon from "../../../utils/Icon";

export default class storyPreview extends Component {
    constructor(props) {
      super(props);
      this.state = {
        device: 'mobile', // tablet
        orientation: 'vertical', // horizontal
        displayFormats: [
          { key: '0', value: 'd16-9', text: '16:9' },
          { key: '1', value: 'd16-10', text: '16:10'},
          { key: '2', value: 'd18-9', text: '18:9' },
          { key: '3', value: 'd19-9', text: '19:9' },
          { key: '4', value: 'd21-9', text: '21:9'}
        ],
        display: 'd16-9',
        loading: false,
        story: this.props.story,
        theme: this.props.theme,
        server: this.props.server,
        modal: this.props.modal,
        styleSheet: {
          wrap:{
            display:'flex',
            flexDirection: 'row',
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
          },
          device: {
            color: '#FFF',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            alignItems: 'stretch',
            backgroundColor: '#FFDD00',
          },
          options: {
            display: 'flex',
            background: "transparent",
            paddingRight: 20,
          },
          header: {
            display:'flex',
            background: '#ccc',
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
            fontFamily: this.props.theme.font3,
            fontSize: 13,
            marginTop: 1,
            marginBottom: 1,
            padding: 30,
            lineHeight: 20,
            letterSpacing: 0,
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
          }
        }
      }
      this.togglePreviewOrientation = this.togglePreviewOrientation.bind(this);
    }
    componentDidMount = () => this.setState({modal: true})
    togglePreviewOrientation = () => this.setState({orientation: (this.state.orientation === 'vertical') ? 'horizontal' : 'vertical'})
    togglePreviewDevice = () => this.setState({device: (this.state.device === 'mobile') ? 'tablet' : 'mobile'})
    togglePreviewDisplay = (e) =>  this.setState({display: e.target.textContent.replace(":", "-")})
    togglePreviewClose = () => this.setState({modal: false})
    render() {
    const {styleSheet, display, device, orientation, loading} = this.state;
    let mclass = device + ' ' + orientation + ' ' + display;

    return (

      <div style={styleSheet.wrap} >
        <Modal  basic dimmer='blurring' closeIcon style={styleSheet.modal}
          onClose={this.togglePreviewClose}
           open={this.state.modal}
           centered={false} >
          <Modal.Actions>
            <Form style={styleSheet.options} inverted>
              <Select placeholder='Display' options={this.state.displayFormats} defaultValue={this.state.display} onChange={this.togglePreviewDisplay} />
               <Rail attached position='left' size='tiny' >
                 <Button.Group  >
                   <Button secondary icon onClick={this.togglePreviewOrientation}>   <Icon name='undo alternate' /> </Button>
                   <Button secondary icon onClick={this.togglePreviewDevice}> <Icon name={device+' alternate'} /> </Button>
                 </Button.Group>
               </Rail>

            </Form>
          </Modal.Actions>
          <Modal.Content className={mclass} scrolling>
            <div  style={styleSheet.device}>
              <Header style={styleSheet.header}>
                  <CustomIcon name='menu'/>
                  <CustomIcon style={styleSheet.logo} name='bow-logo'/>
              </Header>
              <div className='tile' style={styleSheet.tile}>
                <h1 style={styleSheet.tileTitle}>{this.state.story.title}</h1>
                <h2 style={styleSheet.tileSubtitle}>{this.state.story.city} - {this.state.story.state}</h2>
              </div>
              <div className='card' style={styleSheet.card} >
                 <div  style={styleSheet.sinopsys}>
                    { ReactHtmlParser(this.state.story.sinopsys) }
                  </div>
                  <div style={styleSheet.credits}>
                   <h1 style={styleSheet.titleCredits}>Credits</h1>
                    { ReactHtmlParser(this.state.story.credits) }
                  </div>
              </div>
              <div className='nav' style={styleSheet.nav} >
                  <div style={styleSheet.message}> Please choose your mode of transportation and press Start Navigation.</div>
                  <div style={styleSheet.transport} >
                    <Button>Caminando</Button>
                    <Button>Auto</Button>
                    <Button>En bici</Button>
                  </div >
                  <div style={styleSheet.menu} >
                      <Button><CustomIcon  name='trash'  /></Button>
                      <Button><CustomIcon  name='play'  /></Button>
                      <Button><CustomIcon  name='geopoint'  /></Button>
                  </div >
               </div>
            </div>
          </Modal.Content>
        </Modal>
      </div>
    )
  }
}
