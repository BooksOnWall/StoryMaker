import React, {PureComponent} from 'react';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';
import { Slider } from "react-semantic-ui-range";
import {
  Label,
    Divider,
  Segment
} from 'semantic-ui-react';
const defaultMapStyle = fromJS(MAP_STYLE);

const categories = ['labels', 'roads', 'buildings', 'parks', 'water', 'background'];

// Layer id patterns by category
const layerSelector = {
  background: /background/,
  water: /water/,
  parks: /park/,
  buildings: /building/,
  roads: /bridge|trunk|street|tunnel/,
  labels: /label|place|poi/
};

// Layer color class by type
const colorClass = {
  line: 'line-color',
  fill: 'fill-color',
  background: 'background-color',
  symbol: 'text-color'
};

//const defaultContainer = ({children}) => <div className="control-panel">{children}</div>;

export default class StyleControls extends PureComponent {
  constructor(props) {
    super(props);
    this._defaultLayers = defaultMapStyle.get('layers');
    console.log(this.props.colors);
    this.state = {
      visibility: {
        water: true,
        parks: true,
        buildings: true,
        roads: true,
        labels: true,
        background: true
      },
      color: {
        water: (this.props.colors.water) ? this.props.colors.water : '#aad9f5',
        parks: (this.props.colors.landuse_park) ? this.props.colors.landuse_park : '#2bedbd',
        buildings: (this.props.colors.buildings) ? this.props.colors.building : '#2d2e23',
        roads: (this.props.colors.road_major) ? this.props.colors.road_major : '#5a5050',
        labels: (this.props.colors.place_label) ? this.props.colors.place_label :'#FFFFFF',
        background: (this.props.colors.background) ? this.props.colors.background : '#02020e'
      },
      zsettings : {
          start: this.props.viewport.zoom,
          min: 0,
          max: 24,
          step: 1,
          onChange: value => this.props.setViewport('zoom', value)
        },
        psettings : {
          start: this.props.viewport.pitch,
          min: 0,
          max: 60,
          step: 1,
          onChange: value => this.props.setViewport('pitch', value),
        },
        bsettings : {
          start: this.props.viewport.bearing,
          min: -180,
          max: 180,
          step: 1,
          onChange: value =>   this.props.setViewport('bearing', value)
        }
    };
  }

  componentDidMount() {
    this._updateMapStyle(this.state);
  }

  _onColorChange(name, event) {
    const color = {...this.state.color, [name]: event.target.value};
    this.setState({color});
    this._updateMapStyle({...this.state, color});
  }

  _onVisibilityChange(name, event) {
    const visibility = {
      ...this.state.visibility,
      [name]: event.target.checked
    };
    this.setState({visibility});
    this._updateMapStyle({...this.state, visibility});
  }

  _updateMapStyle({visibility, color}) {
    const layers = this._defaultLayers
      .filter(layer => {
        const id = layer.get('id');
        return categories.every(name => visibility[name] || !layerSelector[name].test(id));
      })
      .map(layer => {
        const id = layer.get('id');
        const type = layer.get('type');
        const category = categories.find(name => layerSelector[name].test(id));
        if (category && colorClass[type]) {
          return layer.setIn(['paint', colorClass[type]], color[category]);
        }
        return layer;
      });

    this.props.onChange(defaultMapStyle.set('layers', layers));
  }

  _renderLayerControl(name) {
    const {visibility, color} = this.state;

    return (
      <div key={name} className="input colorSelector">
            <span><input
                className="right floated"
              type="color"
              value={color[name]}
              disabled={!visibility[name]}
              onChange={this._onColorChange.bind(this, name)}
            /></span>
            <Label className="labelLayer inverted">{name}</Label>
            <input
              className="left floated"
              type="Checkbox"
              checked={visibility[name]}
              onChange={this._onVisibilityChange.bind(this, name)}
            />
     </div>
    );
  }

  render() {
    //const Container = this.props.containerComponent || defaultContainer;

    return (
   <Segment  className="stylingMap" inverted>
        <h3>Map Styling</h3>
        <Divider />
        {categories.map(name => this._renderLayerControl(name))}
        <Divider />
        <Segment inverted className="parametersMap">
          <Label className="labelLayer inverted">Zoom: {this.props.viewport.zoom.toFixed(2)}</Label>  <Slider inverted name="zoom" value={this.props.viewport.zoom} primary settings={this.state.zsettings} />
          <Label className="labelLayer inverted">Pitch: {this.props.viewport.pitch.toFixed(2)}</Label> <Slider inverted name="pitch" value={this.props.viewport.pitch} primary settings={this.state.psettings}/>
          <Label className="labelLayer inverted">Bearing: {this.props.viewport.bearing.toFixed(2)}</Label> <Slider inverted name="bearing" value={this.props.viewport.bearing} primary settings={this.state.bsettings} />
        </Segment>
    </Segment>
    );
  }
}
