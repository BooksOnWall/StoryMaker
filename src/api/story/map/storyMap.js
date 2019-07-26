import React, { Component } from 'react';
import Auth from '../../../module/Auth';
import {
  Segment,
  Divider,
  Dropdown,
} from 'semantic-ui-react';
import MapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import StylePanel from './stylePanel';

let MapboxAccessToken = process.env.REACT_APP_MAT;

class storyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      mapStyle: '',
      viewport: {
        latitude: -34.9022229,
        longitude: -56.1670182,
        zoom: 11,
        bearing: 0,
        pitch: 0
      }
    }
  };
  componentDidMount() {
    // check if user is logged in on refresh
    this.toggleAuthenticateStatus()
  }

  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
  }
  onViewportChange = viewport => this.setState({viewport});
  onStyleChange = mapStyle => this.setState({mapStyle});
  render() {
    const {viewport, mapStyle} = this.state;
    return (
      <MapGL
        {...viewport}
        width="80vw"
        height="80vh"
        mapStyle={mapStyle}
        onViewportChange={this.onViewportChange}
        mapboxApiAccessToken={MapboxAccessToken}
      >
        <StylePanel
          containerComponent={this.props.containerComponent}
          onChange={this.onStyleChange}
        />
      </MapGL>
    );
  }
}
export default storyMap;
