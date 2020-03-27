import React, { Component } from 'react';
import {
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import MapGL, {Marker, Popup, FlyToInterpolator} from 'react-map-gl';
import 'react-map-gl-geocoder/dist/mapbox-gl-geocoder.css';
import DeckGL, { GeoJsonLayer } from "deck.gl";
import Geocoder from "react-map-gl-geocoder";

import * as d3 from 'd3-ease';
import 'mapbox-gl/dist/mapbox-gl.css';
import MAP_STYLE from './map-style-basic-v8.json';
import StagePin from './stagePin';

let MapboxAccessToken = process.env.REACT_APP_MAT;


class storyLocation extends Component {
  constructor(props) {
    super(props);
    let location = (this.props.stageLocation)
      ? this.props.stageLocation
      : [-56.1670182, -34.9022229  ];
      let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
      let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
      let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      sid: (!this.props.sid) ? (0) : (parseInt(this.props.sid)),
      mode: (!this.props.mode) ? (0) : this.props.mode,
      mapURL: server + 'stories/'+ this.props.sid +'/map',
      loading: false,
      mapStyle: null,
      active: 'Map',
      stagePosition: null,
      location: (location) ? location : null ,
      //bounds: bounds,
      popupInfo: null,
      viewport: {
        latitude: (parseFloat(location[1])) ? parseFloat(location[1]) : -34.9022229  ,
        longitude: (parseFloat(location[0])) ? parseFloat(location[0]) : -56.1670182 ,
        zoom: 18,
        bearing: -60, // bearing in degrees
        pitch: 60  // pitch in degrees
      },
      interactiveLayerIds: []
    };
  }
  getMapPreferences = async () => {
    try {
      await fetch(this.state.mapURL, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            const map  = JSON.parse(data.map);
            this.setState({mapStyle: map.style});
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log(error)
      });
    } catch(e) {
      console.log(e.message);
    }
  }
  componentDidMount = async () => {
    try {
      console.log('map start');
      this.setState({loading: false});
      await this.getMapPreferences();
    } catch(e) {
      console.log(e.message);
    }
  }
  toggleLoading(val) {
    this.setState({loading: val});
  }
  onClickMap = (map, evt) => {
    this.setState({stagePosition: map.lngLat});
    this.renderStageMarker(map.lngLat);
    this.props.setStageLocation(map.lngLat);
  }
  mapRef = React.createRef();

handleViewportChange = viewport => {
  this.setState({
    viewport: { ...this.state.viewport, ...viewport }
  });
};

// if you are happy with Geocoder default settings, you can just use handleViewportChange directly
handleGeocoderViewportChange = viewport => {
  const geocoderDefaultOverrides = {
    transitionInterpolator: new FlyToInterpolator(),
    transitionEasing: d3.easeCubic,
    transitionDuration: 1500,
    zoom: 15
   };

  return this.handleViewportChange({
    ...viewport,
    ...geocoderDefaultOverrides
  });
};

handleOnResult = event => {
  console.log(event.result);
  this.setState({
    searchResultLayer: new GeoJsonLayer({
      id: "search-result",
      data: event.result.geometry,
      getFillColor: [255, 0, 0, 128],
      getRadius: 1000,
      pointRadiusMinPixels: 10,
      pointRadiusMaxPixels: 10
    })
  });
};
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
  goToStage = () => {
    let location = this.props.stageLocation;
    let lng = parseFloat(location[0]);
    let Lat = parseFloat(location[1]);
    console.log(this.state.location);
        const viewport = {
            ...this.state.viewport,
            longitude: lng,
            latitude: Lat,
            zoom: 20,
            transitionDuration: 1500,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic
        };
        this.setState({viewport});
    };
  render() {
    const {mapStyle, viewport, searchResultLayer, interactiveLayerIds,  loading} = this.state;
    return (
      <Segment  className="storyLocation" >
        <Dimmer.Dimmable as={Segment} blurring dimmed={this.state.loading}>
          <Dimmer active={this.state.loading} onClickOutside={this.handleHide} />
            <Loader active={loading} >Get map info</Loader>
            <MapGL
              {...viewport}
              width="inherit"
              ref={this.mapRef}
              height={this.props.height}
              mapStyle={mapStyle}
              clickRadius={2}
              onClick={this.onClickMap}
              getCursor={this.getCursor}
              interactiveLayerIds={interactiveLayerIds}
              onViewportChange={this.onViewportChange}
              mapboxApiAccessToken={MapboxAccessToken}
            >
              <Geocoder
                mapRef={this.mapRef}
                onResult={this.handleOnResult}
                onViewportChange={this.handleGeocoderViewportChange}
                mapboxApiAccessToken={MapboxAccessToken}
                position="top-left"
              />
              <DeckGL {...viewport} layers={[searchResultLayer]} />

              {(this.props.stageLocation) ?
                <Marker key='stage' longitude={parseFloat(this.props.stageLocation[0])} latitude={parseFloat(this.props.stageLocation[1])}>
                  <StagePin size={20} onClick={() => this.setState({popupInfo: 'toto'})} />
                  Stage location
                </Marker>
               :''}
            </MapGL>

        </Dimmer.Dimmable>
    </Segment>
    );
  }
}
export default storyLocation;
