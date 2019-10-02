import React, { Component } from 'react';
import {
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
      <Dimmer.Dimmable as={Segment} blurring dimmed={loading}>
          <Dimmer active={loading} onClickOutside={this.handleHide} />
          <Loader active={loading} >Get map info</Loader>
            <Segment  className="view map" >
              <MapGL
                {...viewport}
                width="94vw"
                height="78vh"
                mapStyle={mapStyle}
                onViewportChange={this.onViewportChange}
                mapboxApiAccessToken={MapboxAccessToken}
              >
                <StylePanel
                  containerComponent={this.props.containerComponent}
                  onChange={this.onStyleChange}
                />
              </MapGL>
          </Segment>
        </Dimmer.Dimmable>
    );
  }
}
export default storyMap;
