import React, { Component } from 'react';

import {
  Segment,
  Table,
  Button,
  Message,
  Placeholder,
  Confirm,
  Icon
} from 'semantic-ui-react';

import ReactDragListView  from 'react-drag-listview';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import StagesMap from '../map/stagesMap';

class storyStages extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.fileInputRef = React.createRef();
    this.state = {
      active: 'Stages',
      server: server,
      column: null,
      history: this.props.history,
      importURL: server + 'stories/' + props.sid + '/import',
      importLoading: false,
      direction: null,
      stages: null,
      location: null,
      listStages: this.listStages,
      confirmOpen: false,
      sid: parseInt(this.props.sid),
      stagesURI: server + 'stories/' + parseInt(props.sid) +'/stages',
      mode: (parseInt(this.props.sid) === 0) ? ('create') : ('update'),
    };

    const that = this;
    this.dragProps = {
      onDragEnd(fromIndex, toIndex) {
        const stages = that.state.stages;
        const item = stages.splice(fromIndex, 1)[0];
        stages.splice(toIndex, 0, item);
        that.setState({
          stages
        });
      },
      handleSelector: "a"
    };
    this.handleCreate = this.handleCreate.bind(this);
  }
  tableRowClickFunc(stage) {
    const url = '/stories/' + this.state.sid + '/stages/' + stage.id;
    return this.props.history.push(url);
  }
  handleCreate = (e) => {
    const url = '/stories/' + this.state.sid + '/stages/' + 0;
    return this.props.history.push(url);
  }
  componentDidMount = async () => {
    try {
      await this.listStages();
    } catch(e) {
      console.log(e.message);
    }
  }
  listStages = async () => {
    // set loading
    this.setState({loading: true});
    await fetch(this.state.stagesURI, {
      method: 'get',
      headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
    })
    .then(response => {
      if (response && !response.ok) { throw new Error(response.statusText);}
      return response.json();
    })
    .then(data => {
        if(data) {
          this.setState({stages: data, loading: false});
          this.setState({location: data[0].geometry.coordinates});
          console.log(data[0].geometry.coordinates);
          return data;
        } else {
          console.log('No Data received from the server');
        }
    })
    .catch((error) => {
      // Your error is here!
      //console.log(error)
    });
  }
  open = () => this.setState({ confirmOpen: true })
  close = () => this.setState({ confirmOpen: false })
  geojsonImport = async (e) => {
    //this.open();
    this.setState({importLoading: true});
    try {
      let files = e.target.files;
      let formData = new FormData();
      let file;
      for(var x = 0; x < files.length; x++) {
        formData.append('file', files[x]);
        file = files[x];
      };

      await fetch(this.state.importURL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept':'application/json; charset=utf-8'
        },
        files: JSON.stringify(file),
        body: formData
       })
       .then(response => response.json())
       .then(data => {
         this.setState({importLoading: false});
         return this.listStages();
       });
    } catch(e) {
      console.log(e.message);
    }
  }
  ImportPreview = (geojson) => {

    let features = (typeof(geojson) === 'object') ? geojson : null;
    if(!features) {return null}

    return (
      <Segment>
      <Message
        attached
        header='Warning'
        content='This will erase and recreate all stages datas !'
        />
      <Table color='violet' sortable celled  selectable>
        <Table.Header fullWidth>
          <Table.Row>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Type</Table.HeaderCell>
            <Table.HeaderCell>Coordonates</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {(features) ?
            features.map(feature  => (
              <Table.Row className='slide-out'  key={feature.properties.Name}>
                <Table.Cell>{feature.properties.Name}</Table.Cell>
                <Table.Cell>{feature.geometry.type}</Table.Cell>
                <Table.Cell>{feature.geometry.coordinates}</Table.Cell>
              </Table.Row>
            )) : ''}
      </Table.Body>
      </Table>
      </Segment>
    )
  }
  render() {

    return (
      <Segment.Group horizontal>
        <Segment style={{width: '40vw' }} className="stagesMap">
          {(this.state.location)
            ? <StagesMap goToStage={this.goToStage} stages={this.state.stages} location={this.state.location} state={this.state}/>
            : <Placeholder>
              <Placeholder.Image rectangular />
            </Placeholder>
          }
        </Segment>
        <Segment  className="stages">
          <Button.Group>
            <Button primary onClick={this.handleCreate}><Icon name="google wallet" />Add Stage</Button>
            <Button.Or />
            <Button negative loading={this.state.importLoading} onClick={() => this.fileInputRef.current.click()}><Icon name="point" />GeoJSON import</Button>
              <input
                id='importfile'
                name="files"
                ref={this.fileInputRef}
                type="file"
                accept=".json,.geojson"
                hidden
                onChange={this.geojsonImport}
             />
           <Confirm
               header='Are you sure ?'
               content={this.ImportPreview}
               cancelButton='Never mind'
               confirmButton="Let's do it"
               open={this.state.confirmOpen}
               onCancel={this.close}
               onConfirm={this.close}
             />
            <Button.Or />
            <Button positive><Icon name="external square alternate" /> GeoJSON export</Button>
          </Button.Group>
          <ReactDragListView {...this.dragProps}>
            <Table color='violet' inverted compact sortable  selectable>
              <Table.Header className='slide-out'>
                <Table.Row>
                  <Table.HeaderCell   >
                    <FormattedMessage id="app.stage.drag" defaultMessage={`Drag me`} />
                  </Table.HeaderCell>
                  <Table.HeaderCell >
                    <FormattedMessage id="app.stage.name" defaultMessage={`Name`} />
                  </Table.HeaderCell>
                  <Table.HeaderCell   >
                    <FormattedMessage id="app.stage.rank" defaultMessage={`Type`} />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {_.map(this.state.stages, ({ id, name, type, description , updatedAt, rank }) => (
                  <Table.Row className='slide-out' key={id} onClick={() => this.tableRowClickFunc({id})}>
                    <Table.Cell>{<a className="drag-handle" href="void(0)"><Icon name='grab' size='tiny' /> Drage Me</a>}</Table.Cell>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>{type}</Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table>
          </ReactDragListView>
        </Segment>
      </Segment.Group>
    );
  }
}
export default storyStages;
