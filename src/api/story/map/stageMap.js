import React, { Component } from 'react';
import {
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import MapGL, {Marker, Popup, NavigationControl, FullscreenControl} from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MAP_STYLE from './map-style-basic-v8.json';
import StagePin from './stagePin';
import ControlPanel from './controlPanel';
import {fromJS} from 'immutable';
import HtmlParser from 'react-html-parser';
let MapboxAccessToken = process.env.REACT_APP_MAT;
// Set bounds toMontevideo
var bounds = [
  [-34.9036749, -56.2189153], // Southwest coordinates
  [-34.9068829, -56.211639]  // Northeast coordinates
];

class stageMap extends Component {
  constructor(props) {
    super(props);
    let location = (this.props.stageLocation) ?this.props.stageLocation : [-34.9022229, -56.1670182];
    console.log(location);
    this.state = {
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      sid: (!this.props.sid) ? (0) : (parseInt(this.props.sid)),
      loading: null,
      mapStyle: '',
      active: 'Map',
      stagePosition: null,
      bounds: bounds,
      popupInfo: null,
      viewport: {
        latitude: (parseFloat(location[0])) ? parseFloat(location[0]) : -34.9022229 ,
        longitude: (parseFloat(location[1])) ? parseFloat(location[1]) : -56.1670182 ,
        zoom: 18,
        bearing: -60, // bearing in degrees
        pitch: 60  // pitch in degrees
      },
      interactiveLayerIds: []
    };
  }
  toggleLoading(val) {
    this.setState({loading: false});
  }
  onClickMap = (map, evt) => {
    this.setState({stagePosition: map.lngLat});
    this.renderStageMarker(map.lngLat);
    this.props.setStageLocation(map.lngLat);
  }
  renderPopup() {
    const {popupInfo} = this.state;

    return (
      popupInfo && (
        <Popup
          tipSize={5}
          anchor="top"
          longitude={popupInfo.longitude}
          latitude={popupInfo.latitude}
          closeOnClick={false}
          onClose={() => this.setState({popupInfo: null})}
        >
          {this.state.popupInfo.name}
        </Popup>
      )
    );
  }
  onViewportChange = viewport => this.setState({viewport});
  onStyleChange = mapStyle => this.setState({mapStyle});
  onInteractiveLayersChange = layerFilter => {
    this.setState({
      interactiveLayerIds: MAP_STYLE.layers.map(layer => layer.id).filter(layerFilter)
    });
  };

  getCursor = ({isHovering, isDragging}) => {
    return isHovering ? 'pointer' : 'default';
  };
  renderStageMarker = (lngLat) => {
    return (
      <Marker key={`marker-${1}`} longitude={lngLat[0]} latitude={lngLat[1]}>
        <StagePin size={20} onClick={() => this.setState({popupInfo: lngLat})} />
      </Marker>
    );
  };
  render() {
    const {viewport, interactiveLayerIds, mapStyle, loading} = this.state;
    return (
      <Segment  className="stageMap" >
      <Dimmer active={loading}>
        <Loader active={loading} >Get map info</Loader>
      </Dimmer>

      <MapGL
        {...viewport}
        width="inherit"
        height="40vh"
        mapStyle={MAP_STYLE}
        clickRadius={2}
        onClick={this.onClickMap}
        getCursor={this.getCursor}
        interactiveLayerIds={interactiveLayerIds}
        onViewportChange={this.onViewportChange}
        mapboxApiAccessToken={MapboxAccessToken}
      >
        {(this.props.stageLocation) ?
          <Marker key='stage' longitude={parseFloat(this.props.stageLocation[0])} latitude={parseFloat(this.props.stageLocation[1])}>
            <StagePin size={20} onClick={() => this.setState({popupInfo: 'toto'})} />
            Stage location
          </Marker>
         :''}
      </MapGL>
    </Segment>
    );
  }
}
export default stageMap;
