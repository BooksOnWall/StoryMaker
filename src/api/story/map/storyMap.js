import React, { Component } from 'react';
import Auth from '../../../module/Auth';
import {
  Segment,
  Divider,
  Dropdown,
} from 'semantic-ui-react';
import ReactMapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
let MapboxAccessToken = process.env.REACT_APP_MAT;
class storyMap extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authenticated: false,
      viewport: {
        width: 950,
        height: 800,
        latitude: -34.9022229,
        longitude: -56.1670182,
        zoom: 8
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
  render() {
    return (
      <ReactMapGL mapboxApiAccessToken={MapboxAccessToken}
        {...this.state.viewport}
        onViewportChange={(viewport) => this.setState({viewport})}
      />
    );
  }
}
export default storyMap;
