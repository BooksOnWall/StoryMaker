import React, { Component } from 'react';
import Auth from '../../../module/Auth';
import {
  Button,
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

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
      authenticated: false,
      loading: null,
      mapStyle: '',
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
    await this.toggleAuthenticateStatus();
    //await this.setState({loading: true});
  }
  toggleLoading(val) {
    this.setState({loading: false});
  }
  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() });
  }
  onViewportChange = viewport => this.setState({viewport});
  onStyleChange = mapStyle => this.setState({mapStyle});
  render() {
    const {viewport, mapStyle, loading} = this.state;
    return (
      <Segment inverted color="violet" className="view map">

      <Dimmer active={loading}>
        <Loader active={loading} >Get map info</Loader>
      </Dimmer>
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
