import React, { Component } from 'react';
import {
  Button,
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';
import StorySteps from '../storySteps';
import MapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import StylePanel from './stylePanel';

let MapboxAccessToken = process.env.REACT_APP_MAT;
// Set bounds toMontevideo
var bounds = [
  [-34.9036749, -56.2189153], // Southwest coordinates
  [-34.9068829, -56.211639]  // Northeast coordinates
];
class storyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
      sid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
      loading: null,
      mapStyle: '',
      active: 'Map',
      bounds: bounds,
      viewport: {
        latitude: -34.9022229,
        longitude: -56.1670182,
        zoom: 13,
        bearing: -60, // bearing in degrees
        pitch: 60  // pitch in degrees
      }
    }
  };

  async componentDidMount() {
    // check if user is logged in on refresh
    try {
      await this.state.toggleAuthenticateStatus;
      //await this.setState({loading: true});
    } catch(e) {
      console.log(e.message);
    }

  }
  toggleLoading(val) {
    this.setState({loading: false});
  }
  onViewportChange = viewport => this.setState({viewport});
  onStyleChange = mapStyle => this.setState({mapStyle});
  render() {
    const {viewport, mapStyle, loading} = this.state;
    return (
      <Segment  className="view map" fluid>

      <Dimmer active={loading}>
        <Loader active={loading} >Get map info</Loader>
      </Dimmer>
      <StorySteps sid={this.state.sid} active={this.state.active}/>
      <MapGL
        {...viewport}
        width="100vw"
        height="100vh"
        mapStyle={mapStyle}
        onViewportChange={this.onViewportChange}
        mapboxApiAccessToken={MapboxAccessToken}
      >
        <Button floated primary right onClick={this.props.history.goBack}>Back</Button>
        <StylePanel
          containerComponent={this.props.containerComponent}
          onChange={this.onStyleChange}
        />
      </MapGL>
    </Segment>
    );
  }
}
export default storyMap;
