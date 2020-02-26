import React, {Component} from 'react';
import {
  Segment,
  Image,
  Header,
    Icon,
    List,
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
          mobileContainer: {
            color: '#FFF',
            backgroundColor: 'transparent',
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginTop: 0
          },
          tile: {
            background: 'transparent url('+ this.props.server+this.props.theme.banner.path+') no-repeat top left',
          },
          tileTitle: {
            fontFamily: this.props.font1,
            color: this.props.color1,
          },
        }
      }
    }
    render() {
    const {styleSheet, device, disposition, loading} = this.state;
    return (
      <Segment className="movile" style={styleSheet.mobileContainer}>
        <Header >
            <Icon name="home"/>
        </Header>
        <Segment vertical>
            <div vertical style={styleSheet.tile}>
                <h1>title</h1>
                <h2>City - Country</h2>
             </div>
            <Segment vertical className="text">
             <Segment vertical  className="sinopsys">
              { ReactHtmlParser(this.state.story.sinopsys) }
              </Segment>
              <Segment vertical  className="credits">
                { ReactHtmlParser(this.state.story.credits) }
              </Segment>
            </Segment>
        </Segment>
        <Segment >
            <List horizontal>
                <List.Item>
                    <Icon  name='trash'  />
                </List.Item>
                <List.Item>
                    <Icon  name='play'  />
                </List.Item>
                <List.Item>
                    <Icon  name='point'  />
                </List.Item>
            </List>
        </Segment>
      </Segment>
    )
  }
}
