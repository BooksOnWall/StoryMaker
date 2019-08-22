import React, { Component } from 'react';
import {
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import MapGL  from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MAP_STYLE from './map-style-basic-v8.json';
import ControlPanel from './controlPanel';
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
      },
      interactiveLayerIds: []
    };
  }
  toggleLoading(val) {
    this.setState({loading: false});
  }
  onViewportChange = viewport => this.setState({viewport});
  onStyleChange = mapStyle => this.setState({mapStyle});
  onInteractiveLayersChange = layerFilter => {
    this.setState({
      interactiveLayerIds: MAP_STYLE.layers.map(layer => layer.id).filter(layerFilter)
    });
  };

  onClick = event => {
    const feature = event.features && event.features[0];

    if (feature) {
      window.alert(`Clicked layer ${feature.layer.id}`); // eslint-disable-line no-alert
    }
  };

  getCursor = ({isHovering, isDragging}) => {
    return isHovering ? 'pointer' : 'default';
  };
  render() {

    const {viewport, interactiveLayerIds, mapStyle, loading} = this.state;
    return (
      <Segment  className="view stagesMap" >

      <Dimmer active={loading}>
        <Loader active={loading} >Get map info</Loader>
      </Dimmer>

      <MapGL
        {...viewport}
        width="inherit"
        height="50vh"
        mapStyle={MAP_STYLE}
        clickRadius={2}
        onClick={this.onClick}
        getCursor={this.getCursor}
        interactiveLayerIds={interactiveLayerIds}
        onViewportChange={this.onViewportChange}
        mapboxApiAccessToken={MapboxAccessToken}
      >
      <ControlPanel
        containerComponent={this.props.containerComponent}
        onChange={this.onInteractiveLayersChange}
      />
      </MapGL>
    </Segment>
    );
  }
}
export default stagesMap;
