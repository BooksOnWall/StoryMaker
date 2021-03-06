import React, { Component } from 'react';

import {
  Step,
} from 'semantic-ui-react';
import { FormattedMessage } from 'react-intl';

class artistSteps extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sid: this.props.sid,
      mapPath: (this.props.active === 'Map') ? window.location.reload : this.props.sid + '/map',
      stagesPath: (this.props.active === 'Stages') ? window.location.reload : this.props.sid + '/stages',
      active: this.props.active
    }
    this.handleSteps = this.handleSteps.bind(this);
  }
  handleSteps = (e) => {
    e.preventDefault();
    let step = (e.target.name) ? e.target.name : null;
    let to = (e.target.to && e.target.link) ? e.taget.to : null;
    if (step) this.props.state.setSteps({step: step});
    if(to) this.props.history.push(to);
  }
  render() {

    return (
      <Step.Group fluid className="inverted">
        <Step
          icon='area graph'
          active = {this.props.state.step === 'Artist'}
          completed = {this.props.state.artistCompleted}
          name='Artist'
          onClick={this.handleSteps}
          title={<FormattedMessage id="app.artist.artistSteps.artist.edit"  defaultMessage={'Edit Artist'} />}
          //description={<FormattedMessage id="app.artist.artistSteps.artist.edit.description"  defaultMessage={'Things'} />}
        />
        <Step
          active = {this.props.state.step === 'Images'}
          completed = {this.props.state.imagesCompleted}
          disabled ={(this.props.state.mode === 'update') ? false : true }
          name='Images'
          onClick={this.handleSteps}
          icon='images'
          title ={<FormattedMessage id="app.artist.artistSteps.artist.images"  defaultMessage={'Images'} />}
          //description={<FormattedMessage id='app.artist.artistSteps.artist.images.desc' defaultMesssages={'Images'} />}
        />
        <Step
          active = {this.props.state.step === 'Bio'}
          completed = {this.props.state.bioCompleted}
          disabled ={(this.props.state.mode === 'update') ? false : true }
          name='Bio'
          onClick={this.handleSteps}
          icon='book'
          title={<FormattedMessage id="app.artist.artistSteps.artist.bio"  defaultMessage={'Bio'} />}
          //description={<FormattedMessage id="app.artist.artistSteps.artist.bio.biodescription"  defaultMessage={'Biography'} />}
        />
      </Step.Group>
    );
  }
}
export default artistSteps;
