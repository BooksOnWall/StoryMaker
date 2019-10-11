import React, { Component } from 'react';

import {
  Segment,
  Table,
  Button,
  Message,
  Header,
  Image,
  Label,
  Menu,
  Tab,
  Placeholder,
  Confirm,
  Dimmer,
  Progress,
  Accordion,
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
      preflightURL: server + 'stories/' + props.sid + '/preflight',
      downloadStoryURL: server + 'stories/' + props.sid + '/download',
      preflight: null,
      importLoading: false,
      exportLoading: false,
      exportConfirm: false,
      direction: null,
      story: null,
      stages: null,
      activeIndex: null,
      location: null,
      listStages: this.listStages,
      confirmOpen: false,
      sid: parseInt(props.sid),
      stagesURI: server + 'stories/' + parseInt(props.sid) +'/stages',
      mode: (parseInt(props.sid) === 0) ? ('create') : ('update'),
    };

    const that = this;
    this.dragProps = {
      onDragEnd(fromIndex, toIndex) {
        let stages = that.state.stages;
        const item = stages.splice(fromIndex, 1)[0];
        // set new index
        item.stageOrder = toIndex;
        //slice item in the list
        stages.splice(toIndex, 0, item);
        // reindex all list
        stages = stages.map((stage, index) =>{stage.stageOrder = index +1; return stage});
        that.setState({
          stages
        });
        return that.reindexStages(props.sid, stages);
      },
      handleSelector: "a"
    };
    this.handleCreate = this.handleCreate.bind(this);
    this.reindexStages = this.reindexStages.bind(this);
  }
  reindexStages = async (sid, stages) => {
    try {
      await fetch(this.state.stagesURI, {
        method: 'PATCH',
        credentials: 'same-origin',
        headers: {'Access-Control-Allow-Origin': '*',  'Content-Type':'application/json'},
        body: JSON.stringify({stages: stages})
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            return data;
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
          return data;
        } else {
          console.log('No Data received from the server');
        }
    })
    .catch((error) => {
      // Your error is here!
      console.log(error)
    });
  }
  open = () => this.setState({ confirmOpen: true })
  close = () => this.setState({ confirmOpen: false })
  exportOpen = () => {
    this.setState({ exportConfirm: true, exportLoading: true });
    return this.preflight();
  }
  exportClose = () => this.setState({ exportConfirm: false, exportLoading: false })
  storyExport = async () => {
    try {
      this.setState({ exportConfirm: false });
      return this.downloadStory(this.state.sid);
    } catch(e) {
      console.log(e.message);
    }

  }
  downloadStory = async () => {
    try {
      await fetch(this.state.downloadStoryURL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Access-Control-Allow-Origin': '*' },
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({exportLoading: false, exportConfirm: false});
            window.location.href = this.state.server + data.export.src;
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log({error});
      });
    } catch(e) {
      console.log(e.message);
    }
  }
  preflight = async () => {
    try {
      await fetch(this.state.preflightURL, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Accept':'application/json; charset=utf-8'
        },
       })
       .then(response => response.json())
       .then(data => {
         this.setState({stages: data.story.stages, story: data.story, sid: this.state.sid, preflight: data.preflight, exportLoading: true});
         return data
       });
    } catch(e) {
      console.log(e.message);
    }
  }
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
  renderImageList = (list) => {
    return (
      <Message.Item><Image.Group size="tiny">{ list.map((img, index) => (img.src) ? <Image key={index}  src={this.state.server+img.src} /> : '') }</Image.Group></Message.Item>
    );
  }
  handleStageClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }
  renderTabHeader = (sid, ssid, items, category) => {
    let error = 0;
    let win = 0;
    items.map((log, index) => {
      if(ssid) {
        if(log.category === category && log.ssid === ssid ) {
          (log.check === true) ? win ++ : error ++;
        }
      } else {
        if(log.category === category && log.sid === sid ) {
          (log.check === true) ? win ++ : error ++;
        }
      }
      return log;
    });
    let err = (error > 0) ? <Label size="tiny" circular color="red" >{error}</Label>: '';
    let sucess = (win > 0) ? <Label size="tiny" circular color="green" >{win}</Label>: '';
    return <Menu.Item key={category +'messages'}>{err} {sucess} {category.charAt(0).toUpperCase() + category.slice(1)} </Menu.Item>;

  }
  renderItems =  (sid, ssid, items, category) => {
    if (ssid) {
      return (
          items.map((log, index) => (log.category === category && log.ssid === ssid) ? (
            <Message key={log.category+index}  icon color={(log.check) ? 'green' : 'red'}>
            {(log.check) ? <Icon name='check' /> : <Icon name='bug' /> }
            {(log.src) ? <Image   size="small" src={log.src}/> : ''}
            <Message.Content>
              <Message.Header>{log.condition}</Message.Header>
              <Message.List>
              {(!log.check && typeof(log.error) === 'string') ? <Message.Item>{log.error}</Message.Item> : '' }
              {(!log.check && log.category==='pictures' && log.error && typeof(log.error) === 'object') ?  this.renderImageList(log.error) : '' }
              </Message.List>
            </Message.Content>
            </Message> ) : null )
      );
    } else {
      return (
          items.map((log, index) => (log.category === category && log.sid === sid) ? (
            <Message key={log.category+index}  icon color={(log.check) ? 'green' : 'red'}>
            {(log.check) ? <Icon name='check' /> : <Icon name='bug' /> }
            {(log.src) ? <Image   size="small" src={log.src}/> : ''}
            <Message.Content>
              <Message.Header>{log.condition}</Message.Header>
              <Message.List>
              {(!log.check && typeof(log.error) === 'string') ? <Message.Item>{log.error}</Message.Item> : '' }
              {(!log.check && log.category==='pictures' && log.error && typeof(log.error) === 'object') ?  this.renderImageList(log.error) : '' }
              </Message.List>
            </Message.Content>
            </Message> ) : null )
      );
    }

  }
  getByStage = (stage, logs) => {
    if(logs && logs.length > 0) {
      let build =[];
      let tabs = [];
      if(typeof(stage) === 'number') {
        console.log(this.state.story);
        tabs = [
          {
            menuItem: this.renderTabHeader(this.state.story.id,null, logs, 'title'),
            pane: {key: 'photo', content: this.renderItems(this.state.story.id, null, logs, 'title')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, null, logs, 'artist'),
            pane: {key: 'description', content: this.renderItems(this.state.story.id, null, logs, 'artist')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, null, logs, 'state'),
            pane:  {key: 'pictures', content: this.renderItems(this.state.story.id, null, logs, 'state')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, null , logs, 'city'),
            pane:  {key: 'onZoneEnter', content: this.renderItems(this.state.story.id, null, logs, 'city')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, null, logs, 'credits'),
            pane:  {key: 'onPictureMatch', content: this.renderItems(this.state.story.id, null, logs, 'credits')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, null, logs, 'sinopsys'),
            pane:  {key: 'onZoneLeave', content: this.renderItems(this.state.story.id, null, logs, 'sinopsys')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, null, logs, 'json'),
            pane: {key: 'json', content: this.renderItems(this.state.story.id, null, logs, 'json')}
          }
        ];
      } else {
        tabs = [
          {
            menuItem: this.renderTabHeader(this.state.story.id, stage.id, logs, 'photo'),
            pane: {key: 'photo', content: this.renderItems(this.state.story.id, stage.id, logs, 'photo')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, stage.id, logs, 'description'),
            pane: {key: 'description', content: this.renderItems(this.state.story.id, stage.id, logs, 'description')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, stage.id, logs, 'pictures'),
            pane:  {key: 'pictures', content: this.renderItems(this.state.story.id, stage.id, logs, 'pictures')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, stage.id, logs, 'onZoneEnter'),
            pane:  {key: 'onZoneEnter', content: this.renderItems(this.state.story.id, stage.id, logs, 'onZoneEnter')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, stage.id, logs, 'onPictureMatch'),
            pane:  {key: 'onPictureMatch', content: this.renderItems(this.state.story.id, stage.id, logs, 'onPictureMatch')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, stage.id, logs, 'onZoneLeave'),
            pane:  {key: 'onZoneLeave', content: this.renderItems(this.state.story.id, stage.id, logs, 'onZoneLeave')}
          },
          {
            menuItem: this.renderTabHeader(this.state.story.id, stage.id, logs, 'json'),
            pane: {key: 'json', content: this.renderItems(this.state.story.id, stage.id, logs, 'json')}
          }
        ];
      }

      build.push(
        <Tab
          key="preflight"
          renderActiveOnly={false}
          menu={{ color: 'black', inverted: true, attached: false, borderless: true, tabular: false , fluid: false, vertical: true }}
          menuPosition='right'
          panes={tabs}
        />
      );
      return build;
    }
  }
  stageStats = (stage,logs) => {
    let error = 0;
    let win = 0;
    let total = 0;
    if(logs && logs.length >0) {
      logs.map((log, index) => {

        if(typeof(stage) === 'number') {

          if(log.sid === parseInt(stage)) { (log.check === true) ? win ++ : error ++; }
        } else {

          if(log.ssid === stage.id) {
            (log.check === true) ? win ++ : error ++;
          }
        }

        return log;
      });
    }
    total = win + error;
    let percent = (win === 0) ? 0 : parseInt((win / total) * 100);

    let err = (error > 0) ? <Button basic size="tiny"  color="red" >Error [{error}]</Button>: '';
    let sucess = (win > 0) ? <Button basic size="tiny"  color="green" >Success [{win}]</Button>: '';
    let name = (typeof(stage) === 'number') ? <Button style={{width: '30%'}} basic size="tiny"  color="brown" >Story : {(this.state.story) ? this.state.story.title : ''}</Button> : <Button style={{width: '50%'}} basic size="tiny"  color="brown" >{stage.name}</Button> ;
    let progress = <Progress style={{ width: '30%'}}  percent={percent}   progress active indicating inverted />;
    return (
      <Button.Group fluid>{name}{sucess}{err}{progress}</Button.Group>
    );
  }
  storyStats = (story, logs) => {
    let error = 0;
    let win = 0;
    let total = 0;
    if(logs && logs.length >0) {
      logs.map((log, index) => {
        (log.check === true) ? win ++ : error ++;
        return log;
      });
    }
    total = win + error;
    let percent = (win === 0) ? 0 : parseInt((win / total) * 100);
    let err = (error > 0) ? <Button size="tiny" basic  color="red" >Error [{error}]</Button>: '';
    let sucess = (win > 0) ? <Button size="tiny" basic  color="green" >Success [{win}]</Button>: '';
    let progress = <Progress style={{width: '30%'}}  size='large' percent={percent}   progress active indicating inverted />;
    return (
      <Button.Group fluid>{sucess}{err}{progress}</Button.Group>
    );
  }
  ExportPreview = (log) => {
    let stages = this.state.stages;
    const { activeIndex } = this.state;
    return (
      <Segment inverted >
        {this.storyStats(this.state.story, this.state.preflight)}
        <Header>Story : {(this.state.story) ? this.state.story.title : ''} Prefligh Check </Header>
        <Accordion className="preflight"  inverted>
          <Accordion.Title active={activeIndex === -1} index={-1}  onClick={this.handleStageClick}>{this.stageStats(this.state.sid, this.state.preflight)}</Accordion.Title><Accordion.Content className="slide-out" active={activeIndex === -1}>{this.getByStage(this.state.sid, this.state.preflight)}</Accordion.Content>
          {(stages) ? stages.map((stage, index) => <Segment key={index} style={{margin: 0, padding: 0}} inverted ><Accordion.Title active={activeIndex === index} index={index} key={index} onClick={this.handleStageClick}>{this.stageStats(stage, this.state.preflight)}</Accordion.Title><Accordion.Content className="slide-out" active={activeIndex === index}>{this.getByStage(stage, this.state.preflight)}</Accordion.Content></Segment>) : ''}
        </Accordion>
      </Segment>
    );
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
      <Dimmer.Dimmable as={Segment} clearing inverted blurring dimmed={this.state.loading}>
          <Dimmer active={this.state.loading} onClickOutside={this.handleHide} />
            <Segment inverted>
                <Button primary onClick={this.handleCreate}><Icon name="google wallet" />Add Stage</Button>
                <Button.Group floated='right'>
                  <Button negative loading={this.state.importLoading} onClick={() => this.fileInputRef.current.click()}><Icon name="point" />GeoJSON <FormattedMessage id="app.stage.storystage.import" defaultMessage={`import`} /></Button>
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
                     key='import'
                     header='Are you sure ?'
                     content={this.ImportPreview}
                     cancelButton='Never mind'
                     confirmButton="Let's do it"
                     open={this.state.confirmOpen}
                     onCancel={this.close}
                     onConfirm={this.close}
                   />
                  <Button.Or />
                  <Button positive loading={this.state.exportLoading} onClick={this.exportOpen} ><Icon name="external square alternate" /> GeoJSON <FormattedMessage id="app.stage.storystage.export" defaultMessage={`export`} /></Button>
                    <Confirm
                        key='export'
                        basic
                        header='Complete Story GeoJSON Export'
                        content={this.ExportPreview}
                        cancelButton='Never mind'
                        confirmButton="Download story GeoJSON archive"
                        open={this.state.exportConfirm}
                        onCancel={this.exportClose}
                        onConfirm={this.storyExport}
                      />
                </Button.Group>
            </Segment>

            <Segment.Group horizontal  clearing="true" >

              <Segment style={{width: '35vw' }} className="stagesMap">
                {(this.state.location)
                  ? <StagesMap goToStage={this.goToStage} stages={this.state.stages} location={this.state.location} state={this.state}/>
                  : <Placeholder>
                    <Placeholder.Image rectangular />
                  </Placeholder>
                }
              </Segment>

              <Segment  className="stages" >
                <ReactDragListView {...this.dragProps}>
                  <Table inverted compact sortable  selectable>
                    <Table.Header className='slide-out'>
                      <Table.Row>
                        <Table.HeaderCell   >
                          <FormattedMessage id="app.stage.storystage.drag" defaultMessage={`Drag`} />
                        </Table.HeaderCell>
                        <Table.HeaderCell >
                          <FormattedMessage id="app.stage.storystage.name" defaultMessage={`Name`} />
                        </Table.HeaderCell>
                        <Table.HeaderCell   >
                          <FormattedMessage id="app.stage.storystage.type" defaultMessage={`Type`} />
                        </Table.HeaderCell>
                        <Table.HeaderCell   >
                          <FormattedMessage id="app.stage.storystage.order" defaultMessage={`Order`} />
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>
                      {_.map(this.state.stages, ({ id, name, type, description , stageOrder, updatedAt, rank }) => (
                        <Table.Row className='slide-out' key={id} onClick={() => this.tableRowClickFunc({id})}>
                          <Table.Cell>{<a className="drag-handle" href="void(0)"><Icon name='sort' /></a>}</Table.Cell>
                          <Table.Cell>{name}</Table.Cell>
                          <Table.Cell>{type}</Table.Cell>
                          <Table.Cell>{stageOrder}</Table.Cell>
                        </Table.Row>
                        ))}
                    </Table.Body>
                  </Table>
                </ReactDragListView>
              </Segment>
            </Segment.Group>
        </Dimmer.Dimmable>
    );
  }
}
export default storyStages;
