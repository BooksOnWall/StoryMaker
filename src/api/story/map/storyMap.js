import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Segment,
  Dimmer,
  Loader,
  Button,
  Divider,
} from 'semantic-ui-react';

import {  FormattedMessage } from 'react-intl';
import MapGL from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MAP_STYLE from './map-style-basic-v8.json';
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
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      sid: (!this.props.sid) ? (0) : (parseInt(this.props.sid)),
      mapURL: server+'stories/'+this.props.sid+'/map',
      loading: null,
      mapStyle: MAP_STYLE,
      colors: {
        water: '#aad9f5',
        parks: '#2bedbd',
        buildings: '#2d2e23',
        roads: '#5a5050',
        labels: '#FFFFFF',
        background: '#02020e'
      },
      active: 'Map',
      saveMapLoading: false,
      bounds: bounds,
      viewport: {
        latitude: -34.9022229,
        longitude: -56.1670182,
        zoom: 13,
        bearing: -60, // bearing in degrees
        pitch: 60  // pitch in degrees
      },
      setViewport: this.setViewport,
    }
  };
  setViewport = (field, value ) => {
    this.setState({viewport: {
      latitude: this.state.viewport.latitude,
      longitude: this.state.viewport.longitude,
      zoom: (field === 'zoom') ? value: this.state.viewport.zoom ,
      bearing: (field === 'bearing') ? value: this.state.viewport.bearing ,
      pitch: (field === 'pitch') ? value: this.state.viewport.pitch ,
    }})
  }
  async componentDidMount() {
    // check if user is logged in on refresh
    try {
      await this.setState({loading: true});
      await this.state.toggleAuthenticateStatus;
      await this.getMapPreferences();
      //await this.setState({loading: true});
    } catch(e) {
      console.log(e.message);
    }

  }
  toggleLoading(val) {
    this.setState({loading: false});
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
          this.setState({loading: false});
          console.log(data);
          if(data && data.map) {

            const map  = JSON.parse(data.map);
            const colors = {};
            map.style.layers.map((layer) => {
              let color = (layer.paint['background-color']) ? layer.paint['background-color'] : '';
              color = (layer.paint['fill-color']) ? layer.paint['fill-color'] : color;
              color = (layer.paint['line-color']) ? layer.paint['line-color'] : color;
              color = (layer.paint['text-color']) ? layer.paint['text-color'] : color;
              if(layer.paint) { colors[layer.id] = color ; }
              return layer;
            });
            this.setState({colors: colors, mapStyle: map.style, viewport: map.viewport});
          } else {
            console.log('No Data received from the server');
            return this.saveMapPrefs();
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
  saveMapPrefs = async () => {
    try {
      this.setState({saveMapLoading: true});
      let prefs = {
        style: this.state.mapStyle,
        viewport: this.state.viewport
      };
      await fetch(this.state.mapURL, {
        method: 'post',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'},
        body: JSON.stringify({prefs:prefs})
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({saveMapLoading: false});
            this.getMapPreferences();
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

    // fetch
  }
  onViewportChange = viewport => this.setState({viewport});
  onStyleChange = mapStyle => this.setState({mapStyle});

  render() {

    const {viewport, mapStyle, loading} = this.state;
    return (
      <Dimmer.Dimmable as={Segment} blurring dimmed={loading}>
          <Dimmer active={loading} onClickOutside={this.handleHide} />
          <Loader active={loading} ><FormattedMessage id="app.story.map.getmapinfo" defaultMessage={`Get map info`}/></Loader>
            <Segment  className="view map" >
              <MapGL
                {...viewport}
                width="94.5vw"
                height="79.3vh"
                mapStyle={mapStyle}
                onViewportChange={this.onViewportChange}
                mapboxApiAccessToken={MapboxAccessToken}
              >
                <Segment className='mapPref' inverted style={{ width: '19vw', height: '79.3vh', float: 'left'}}>

                {(this.state.colors)
                  ? <StylePanel
                    colors={this.state.colors}
                    setViewport={this.setViewport}
                    viewport={this.state.viewport}
                    containerComponent={this.props.containerComponent}
                    onChange={this.onStyleChange}
                  />

                  : ''}
                <Divider />
                <Button fluid loading={this.state.saveMapLoading} onClick={this.saveMapPrefs} primary>
                <FormattedMessage id="app.story.map.savemappref" defaultMessage={`Save Map Preferences`}/></Button>
                </Segment>
              </MapGL>
          </Segment>
        </Dimmer.Dimmable>
    );
  }
}
export default withRouter(storyMap);
