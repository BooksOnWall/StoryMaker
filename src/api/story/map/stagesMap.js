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
      stages: (this.props.stages && this.props.stages.length > 0) ? this.props.stages : [],
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
  componentDidMount= async () => {
    try {
      await this.handleStages();
    } catch(e) {
      console.log(e.message);
    }
  }
  handleStages = async () => {
    console.log(this.props);
    try {
      let stages = (this.props.stages && this.props.stages.length > 0) ? await this.props.stages : null;
      (stages) ? this.setState({stages: stages}) : this.setState({stages: []});
      console.log(stages);
      if (stages) {return stages;}
    } catch(e) {
      console.log(e.message);
    }

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
  Stages = () => {
    let stages = this.state.stages;
    console.log(stages);
    if(stages && typeof(stages) === 'Array' && stages.length > 0) {
      console.log(typeof(stages));
      stages = (typeof(stages) === 'object') ? Object.values(stages) : stages;
      console.log({stages});
      const listStages = stages.map((stage,i) =>  (
        <Marker
          key={i}
          longitude={parseFloat(stage.geometry.coordinates[0])}
          latitude={parseFloat(stage.geometry.coordinates[1])}
          >
          <StagePin
            size={20}
            onClick={() => this.setState({popupInfo: stage.description})}
            />
        </Marker>
      ));
      return {listStages}
    }
  }
  render() {

    const {viewport, interactiveLayerIds, mapStyle, loading} = this.state;

    return (
      <Segment  className="stagesMap" >

      <Dimmer active={loading}>
        <Loader active={loading} >Get map info</Loader>
      </Dimmer>

      <MapGL
        {...viewport}
        width="inherit"
        height="70vh"
        mapStyle={MAP_STYLE}
        clickRadius={2}
        onClick={this.onClick}
        getCursor={this.getCursor}
        interactiveLayerIds={interactiveLayerIds}
        onViewportChange={this.onViewportChange}
        mapboxApiAccessToken={MapboxAccessToken}
      >

      {this.Stages()}
      </MapGL>
    </Segment>
    );
  }
}
export default stagesMap;
