import React, {PureComponent} from 'react';
import {fromJS} from 'immutable';
import MAP_STYLE from './map-style-basic-v8.json';
import {
  Input,
  Label,
  Segment,
} from 'semantic-ui-react';
const defaultMapStyle = fromJS(MAP_STYLE);

const categories = ['labels', 'roads', 'buildings', 'parks', 'water', 'background'];

// Layer id patterns by category
const layerSelector = {
  background: /background/,
  water: /water/,
  parks: /park/,
  buildings: /building/,
  roads: /bridge|road|tunnel/,
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
        water: '#aad9f5',
        parks: '#2bedbd',
        buildings: '#2d2e23',
        roads: '#5a5050',
        labels: '#080808',
        background: '#02020e'
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
      <div key={name} className="input">
        <Label>{name}</Label>
        <Input
          type="checkbox"
          checked={visibility[name]}
          onChange={this._onVisibilityChange.bind(this, name)}
        />
      <input
          type="color"
          value={color[name]}
          disabled={!visibility[name]}
          onChange={this._onColorChange.bind(this, name)}
        />
      </div>
    );
  }

  render() {
    //const Container = this.props.containerComponent || defaultContainer;

    return (
      <Segment style={{ width: '25vw', height: '25vh', float: 'right'}} inverted color="violet">
        <h3>Map Styling</h3>
        <hr />
        {categories.map(name => this._renderLayerControl(name))}
      </Segment>
    );
  }
}
