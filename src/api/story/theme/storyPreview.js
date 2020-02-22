import React, {Component} from 'react';
import {
  Segment,
  Image,
} from 'semantic-ui-react';

export default class storyPreview extends Component {
  render() {
    return (
      <Segment inverted style={{margin:0}}>
        <Image src={this.props.server+this.props.theme.banner.path} />
      </Segment>
    )
  }
}
