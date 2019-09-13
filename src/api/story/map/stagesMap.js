import React, { Component } from 'react';
import {
  Segment,
  Card,
  Dimmer,
  Loader,
  Image,
  Label,
  Button,
  Icon,
} from 'semantic-ui-react';
import { Link , withRouter} from 'react-router-dom';

import MapGL, { Marker, Popup, LinearInterpolator, FlyToInterpolator } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MAP_STYLE from './map-style-basic-v8.json';
import StagePin from './stagePin';
import ReactHtmlParser from 'react-html-parser';
import * as d3 from 'd3-ease';

let MapboxAccessToken = process.env.REACT_APP_MAT;

// Set bounds toMontevideo
var bounds = [
  [-34.9036749, -56.2189153], // Southwest coordinates
  [-34.9068829, -56.211639]  // Northeast coordinates
];
class stagesMap extends Component {
  constructor(props) {
    super(props);
    let location = this.props.location;
    this.state = {
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      sid: (!this.props.sid) ? (0) : (parseInt(this.props.sid)),
      loading: null,
      mapStyle: '',
      active: 'Map',
      bounds: bounds,
      popupInfo: null,
      stages: (this.props.stages && this.props.stages.length > 0) ? this.props.stages : [],
      viewport: {
        latitude: parseFloat(location[1]),
        longitude: parseFloat(location[0]),
        zoom: 15,
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
    try {
      let stages = (this.props.stages && this.props.stages.length > 0) ? await this.props.stages : null;
      (stages) ? this.setState({stages: stages}) : this.setState({stages: []});
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
  getCursor = ({isHovering, isDragging}) => {
    return isHovering ? 'pointer' : 'default';
  };
  goToStage = (location) => {
    let lng = parseFloat(location[0]);
    let Lat = parseFloat(location[1]);
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
  renderPopup() {
    const {popupInfo} = this.state;
    if(popupInfo) {
      return (
        popupInfo && (
          <Popup
            tipSize={5}
            anchor="top"
            longitude={parseFloat(popupInfo.geometry.coordinates[0])}
            latitude={parseFloat(popupInfo.geometry.coordinates[1])}
            closeOnClick={false}
            onClose={() => this.setState({popupInfo: null})}
          >
          <Card>
            {
              (popupInfo.photo)
              ? <Image
              src={popupInfo.photo[0].src}
              wrapped
              fluid
              ui={false}
              />
            : false}
            <Card.Content>
              <Card.Header>{popupInfo.name}</Card.Header>
              <Card.Meta>Joined in 2016</Card.Meta>
              <Card.Description>{ReactHtmlParser(popupInfo.description)}</Card.Description>
            </Card.Content>
            <Card.Content extra>
              <Button.Group>
                <Button primary as={Link} to={'/stories/'+popupInfo.sid+'/stages/'+popupInfo.id} >
                  <Icon name='edit' />
                  Edit
                </Button>
                <Button inverted color="pink" as='div' labelPosition='right'>
                 <Button icon>
                   <Icon name='heart' />
                   Like
                 </Button>
                 <Label as='a' basic pointing='left'>
                   2,048
                 </Label>
               </Button>
              </Button.Group>
            </Card.Content>
          </Card>
          </Popup>
        )
      );
    }
  }
  handleMapClick= (stage) => {
    this.setState({popupInfo: stage });
    let location = stage.geometry.coordinates;
    this.goToStage(location);
  }
  Stages = () => {
    let stages = this.props.stages;

    if(stages && stages.length > 0) {

      stages = (typeof(stages) === 'object') ? {stages}.stages : stages;
      stages = {stages}.stages;

      const listStages = stages.map((stage,i) =>  (
        <Marker
          key={i}
          longitude={parseFloat(stage.geometry.coordinates[0])}
          latitude={parseFloat(stage.geometry.coordinates[1])}
          >
          <StagePin
            size={20}
            onClick={() => this.handleMapClick(stage)}
            />
          {stage.name}
        </Marker>
      ));
      return listStages
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
      {this.renderPopup()}
      </MapGL>
    </Segment>
    );
  }
}
export default stagesMap;
