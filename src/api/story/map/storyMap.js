import React, { Component } from 'react';
import {
  Segment,
  Dimmer,
  Loader,
  Button,
} from 'semantic-ui-react';
import {  FormattedMessage } from 'react-intl';
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
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      sid: (!this.props.sid) ? (0) : (parseInt(this.props.sid)),
      mapURL: server+'stories/'+this.props.sid+'/map',
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
      await this.state.toggleAuthenticateStatus;
      //await this.setState({loading: true});
    } catch(e) {
      console.log(e.message);
    }

  }
  toggleLoading(val) {
    this.setState({loading: false});
  }
  saveMapPrefs = async () => {
    try {
      console.log(this.state.mapURL);
      let prefs = {
        style: this.state.mapStyle,
        viewport: this.state.viewport
      };
      console.log(prefs);
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
            console.log(data);
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
                width="94vw"
                height="78vh"
                mapStyle={mapStyle}
                onViewportChange={this.onViewportChange}
                mapboxApiAccessToken={MapboxAccessToken}
              >
                <Button onClick={this.saveMapPrefs} primary>Save Map Preferences</Button>
                <StylePanel
                  setViewport={this.setViewport}
                  viewport={this.state.viewport}
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
