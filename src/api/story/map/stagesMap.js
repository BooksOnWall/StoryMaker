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
import {  FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import MapGL, { Marker, Popup, FlyToInterpolator } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MAP_STYLE from './map-style-basic-v8.json';
import StagePin from './stagePin';
import ReactHtmlParser from 'react-html-parser';
import * as d3 from 'd3-ease';

let MapboxAccessToken = process.env.REACT_APP_MAT;


class stagesMap extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    let location = (this.props.geometry) ? this.props.geometry.coordinates: this.props.location ;
    console.log(this.props.viewport);
    this.state = {
      toggleAuthenticateStatus: this.props.toggleAuthenticateStatus,
      authenticated: this.props.authenticated,
      sid: (!this.props.sid) ? (0) : (parseInt(this.props.sid)),
      loading: null,
      mapStyle: null,
      mapURL: server + 'stories/'+ props.sid+'/map',
      active: 'Map',
      popupInfo: null,
      geometry: this.props.geometry,
      stages: (this.props.stages && this.props.stages.length > 0) ? this.props.stages : [],
      viewport: (this.props.viewport && this.props.viewport.length > 0) ? this.props.viewport : {
        latitude: (this.props.stages && this.props.stages.length > 0 && this.props.stages[0]) ? parseFloat(this.props.stages[0].geometry.coordinates[1]): parseFloat(location[1]),
        longitude:  (this.props.stages && this.props.stages.length > 0 && this.props.stages[0]) ? parseFloat(this.props.stages[0].geometry.coordinates[0]) : parseFloat(location[0]),
        zoom: 15,
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
            map.viewport.zoom = 18;
            map.viewport.latitude = parseFloat(this.props.location[1]);
            map.viewport.longitude = parseFloat(this.props.location[0]);
            this.setState({mapStyle: map.style, viewport: map.viewport});
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
  componentDidMount= async () => {
    try {
      await this.getMapPreferences();
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
                <Button primary circul icon basic as={Link} to={'/stories/'+popupInfo.sid+'/stages/'+popupInfo.id} >
                  <Icon name='edit' />
                </Button>
                 <Button as='div' labelPosition='right'>
                      <Button icon circular basic color='pink'>
                        <Icon name='heart' />
                      </Button>
                      <Label as='a' basic color='grey' pointing='left'>
                        2,048
                      </Label>
                    </Button>
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
          <Label circular color="brown">{stage.name}</Label>
        </Marker>
      ));
      return listStages
    }
  }
  render() {

    const {viewport, interactiveLayerIds, loading} = this.state;

    return (
      <Segment  className="stagesMap">
        <Dimmer.Dimmable as={Segment} blurring dimmed={loading}>
          <Dimmer active={loading} onClickOutside={this.handleHide} />
          <Loader className='loader' active={loading} ><FormattedMessage id="app.story.map.stagemap.getmapinfo"  defaultMessage={"Get Map Info"} /></Loader>
            <MapGL
              {...viewport}
              width="inherit"
              height="76.5vh"
              mapStyle={this.state.mapStyle}
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
      </Dimmer.Dimmable>
    </Segment>
    );
  }
}
export default stagesMap;
