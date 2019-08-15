import React, { Component } from 'react';
import {
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import MapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';


let MapboxAccessToken = process.env.REACT_APP_MAT;
// Set bounds toMontevideo
var bounds = [
  [-34.9036749, -56.2189153], // Southwest coordinates
  [-34.9068829, -56.211639]  // Northeast coordinates
];
class stagesMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      sid: (!this.props.sid) ? (0) : (parseInt(this.props.sid)),
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
    };
  }
  toggleLoading(val) {
    this.setState({loading: false});
  }
  onViewportChange = viewport => this.setState({viewport});
  onStyleChange = mapStyle => this.setState({mapStyle});

  render() {

    const {viewport, mapStyle, loading} = this.state;
    return (
      <Segment  className="view stagesMap" >

      <Dimmer active={loading}>
        <Loader active={loading} >Get map info</Loader>
      </Dimmer>

      <MapGL
        {...viewport}
        width="inherit"
        height="50vh"
        onViewportChange={this.onViewportChange}
        mapboxApiAccessToken={MapboxAccessToken}
      >

      </MapGL>
    </Segment>
    );
  }
}
export default stagesMap;
