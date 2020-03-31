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


class storyLocateMap extends Component {
  constructor(props) {
    super(props);
    console.log('viewport',this.props.viewport);
    let location = (this.props.geometry)
      ? this.props.geometry.coordinates
      : [-56.1670182, -34.9022229];
      let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
      let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
      let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
      let viewport = (this.props.viewport) ? this.props.viewport : {};
      const default_geo = {
        type: "Point",
        coordinates: (this.props.viewport) ? [ this.props.viewport.longitude, this.props.viewport.latitude ] : location
      };
      console.log(viewport);
      viewport['zoom'] = 14;
      viewport['latitude'] = location[1];
      viewport['longitude'] = location[0];
      console.log(viewport);
    let geometry = (this.props.geometry) ? this.props.geometry : default_geo;
    this.state = {
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      sid: (!this.props.sid) ? (0) : (parseInt(this.props.sid)),
      mode: (!this.props.mode) ? (0) : this.props.mode,
      mapURL: server + 'stories/'+ this.props.sid +'/map',
      loading: false,
      mapStyle: MAP_STYLE,
      city: (this.props.city && this.props.city !== '') ? this.props.city: null,
      active: 'Map',
      storyPosition: null,
      place_name: null,
      geometry: geometry,
      stages: this.props.stages,
      center: null,
      context: null,
      location: (location) ? location : null ,
      searchResultLayer: null,
      popupInfo: null,
      viewport: viewport,
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
          if(data && !data.error) {
            const map  = JSON.parse(data.map);
            this.setState({mapStyle: map.style});
          } else {
            console.log(data.error);
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
      await this.getMapPreferences();
    } catch(e) {
      console.log(e.message);
    }
  }
  toggleLoading(val) {
    this.setState({loading: val});
  }
  onClickMap = (map, evt) => {
    this.setState({storyPosition: map.lngLat});
    this.renderStoryMarker(map.lngLat);
    //this.props.setStoryLocation(map.lngLat);
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
    zoom: 18
   };

  return this.handleViewportChange({
    ...viewport,
    ...geocoderDefaultOverrides
  });
};

handleOnResult = event => {

  const place_name = event.result.place_name;
  const geometry = event.result.geometry;
  const center = event.result.center;
  const context = event.result.context;
  const viewport = this.state.viewport;

  this.setState({
    place_name: place_name,
    geometry: geometry,
    center: center,
    context: context,
    searchResultLayer: new GeoJsonLayer({
      id: "search-result",
      data: event.result.geometry,
      getFillColor: [255, 0, 0, 128],
      getRadius: 1000,
      pointRadiusMinPixels: 10,
      pointRadiusMaxPixels: 10
    })
  });
  this.props.setFormDataLocation({place_name, geometry, center, context, viewport});
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
  onViewportChange = viewport => {
    const place_name = this.state.place_name;
    const geometry = this.state.geometry;
    const center = this.state.center;
    const context = this.state.context;
    this.setState({viewport});
    this.props.setFormDataLocation({place_name, geometry, center, context, viewport});
  }
  onStyleChange = mapStyle => this.setState({mapStyle});
  onInteractiveLayersChange = layerFilter => {
    this.setState({
      interactiveLayerIds: MAP_STYLE.layers.map(layer => layer.id).filter(layerFilter)
    });
  };

  getCursor = ({isHovering, isDragging}) => {
    return isHovering ? 'pointer' : 'default';
  };
  renderStoryMarker = (lngLat) => {
    return (
      <Marker key={`marker-${1}`} longitude={lngLat[0]} latitude={lngLat[1]}>
        <StagePin size={20} onClick={() => this.setState({popupInfo: lngLat})} />
      </Marker>
    );
  };
  goToStage = () => {
    let location = this.props.geometry.coordinates;
    let lng = parseFloat(location[0]);
    let Lat = parseFloat(location[1]);
    console.log(this.state.location);
        const viewport = {
            ...this.state.viewport,
            longitude: lng,
            latitude: Lat,
            zoom: 18,
            transitionDuration: 1500,
            transitionInterpolator: new FlyToInterpolator(),
            transitionEasing: d3.easeCubic
        };
        this.setState({viewport});
    };
  render() {
    const {stages,mapStyle, searchResultLayer, interactiveLayerIds,  loading} = this.state;
    const viewport = (this.state.viewport) ? this.state.viewport : this.props.viewport;
    const geometry = (this.state.geometry) ? this.state.geometry :this.props.geometry;
    return (
      <Segment  className="storyMap" style={{padding:0}} >
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
                  placeholder= {this.props.city}
                  inputValue={this.props.city}
                  onViewportChange={this.handleGeocoderViewportChange}
                  mapboxApiAccessToken={MapboxAccessToken}
                  position="top-left"
                />
                <DeckGL {...viewport} layers={[searchResultLayer]} />
                {geometry &&
                  <Marker key='story' longitude={parseFloat(geometry.coordinates[0])} latitude={parseFloat(geometry.coordinates[1])}>
                    <StagePin size={20} onClick={() => this.setState({popupInfo: 'toto'})} />
                    Story location
                  </Marker>
                }
                {stages &&
                  stages.map((stage,i) => (
                    <Marker key='story' longitude={parseFloat(stage.geometry.coordinates[0])} latitude={parseFloat(stage.geometry.coordinates[1])}>
                      <StagePin size={20} onClick={() => this.setState({popupInfo: 'toto'})} />
                      {stage.name}
                    </Marker>
                  ))
                }

              </MapGL>
        </Dimmer.Dimmable>
    </Segment>
    );
  }
}
export default storyLocateMap;
