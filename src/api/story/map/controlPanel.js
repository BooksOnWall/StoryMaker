import React, {PureComponent} from 'react';

// Layer id patterns by category
const layerSelector = {
  parks: /park/,
  buildings: /building/,
  roads: /bridge|road|tunnel/,
  labels: /label|place|poi/
};

const defaultContainer = ({children}) => <div className="control-panel">{children}</div>;

function getLayerFilter(categories, layerId) {
  for (const key in categories) {
    if (categories[key] && layerSelector[key].test(layerId)) {
      return true;
    }
  }
  return false;
}

export default class StyleControls extends PureComponent {
  state = {
    categories: {
      parks: true,
      buildings: true,
      roads: true,
      labels: true
    }
  };

  componentDidMount() {
    const filter = getLayerFilter.bind(null, this.state.categories);
    this.props.onChange(filter);
  }

  _onToggleLayer(name, event) {
    const categories = {
      ...this.state.categories,
      [name]: event.target.checked
    };
    this.setState({categories});

    const filter = getLayerFilter.bind(null, categories);
    this.props.onChange(filter);
  }

  _renderLayerControl(name) {
    const {categories} = this.state;

    return (
      <div key={name} className="input">
        <label>{name}</label>
        <input
          type="checkbox"
          checked={categories[name]}
          onChange={this._onToggleLayer.bind(this, name)}
        />
      </div>
    );
  }

  render() {
    const Container = this.props.containerComponent || defaultContainer;

    return (
      <Container>
        <hr />
        <p>Clickable layers</p>
        {Object.keys(layerSelector).map(name => this._renderLayerControl(name))}
      </Container>
    );
  }
}
