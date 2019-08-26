import React, { Component } from 'react';

import {
  Segment,
  Table,
  Button,
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
    let data = { data: [
      {
        key: "1",
        name: "Boran",
        rank: "1"
      },
      {
        key: "2",
        name: "JayChou",
        rank: "2"
      },
      {
        key: "3",
        name: "Lee",
        rank: "3"
      },
      {
        key: "4",
        name: "ChouTan",
        rank: "4"
      },
      {
        key: "5",
        name: "AiTing",
        rank: "5"
      }
    ]};
    this.state = {
      active: 'Stages',
      data: data.data,
      server: server,
      column: null,
      history: this.props.history,
      direction: null,
      stages: null,
      sid: parseInt(this.props.sid),
      stagesURI: server + 'stories/' + parseInt(this.props.sid) +'/stages',
      mode: (parseInt(this.props.sid) === 0) ? ('create') : ('update'),
    };

    const that = this;
    this.dragProps = {
      onDragEnd(fromIndex, toIndex) {
        const data = that.state.data;
        const item = data.splice(fromIndex, 1)[0];
        data.splice(toIndex, 0, item);
        that.setState({
          data
        });
      },
      handleSelector: "a"
    };
    this.handleCreate = this.handleCreate.bind(this);
  }
  tableRowClickFunc(stage) {
    const url = '/stories/' + this.state.sid + '/stages/' + stage.key;
    return this.props.history.push(url);
  }
  handleCreate = (e) => {
    const url = '/stories/' + this.state.sid + '/stages/' + 0;
    return this.props.history.push(url);
  }
  async componentDidMount() {
    // check if user is logged in on refresh
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
          console.log(data);
          this.setState({stages: data});
          // set loading
          this.setState({loading: false});
        } else {
          console.log('No Data received from the server');
        }
    })
    .catch((error) => {
      // Your error is here!
      //console.log(error)
    });
  }
  render() {
    return (
      <Segment.Group horizontal>
        <Segment className="stagesMap"><StagesMap /></Segment>
        <Segment  className="stages">
          <Button primary onClick={this.handleCreate}><Icon name="google wallet" />Add Stage</Button>
          <h2>Table row with dragging (fake datas ...)</h2>
          <ReactDragListView {...this.dragProps}>
            <Table sortable celled  selectable>
              <Table.Header className='slide-out'>
                <Table.Row>
                  <Table.HeaderCell   >
                    <FormattedMessage id="app.stage.drag" defaultMessage={`Drag me`} />
                  </Table.HeaderCell>
                  <Table.HeaderCell >
                    <FormattedMessage id="app.stage.name" defaultMessage={`Name`} />
                  </Table.HeaderCell>
                  <Table.HeaderCell   >
                    <FormattedMessage id="app.stage.rank" defaultMessage={`rank`} />
                  </Table.HeaderCell>
                  <Table.HeaderCell >
                    <FormattedMessage id="app.stage.id" defaultMessage={`Id`} />
                  </Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {_.map(this.state.data, ({ key, name, image, createdAt, updatedAt, rank }) => (
                  <Table.Row className='slide-out' key={key} onClick={() => this.tableRowClickFunc({key})}>
                    <Table.Cell>{<a className="drag-handle" href="void(0)"><Icon name='grab' size='tiny' /> Drage Me</a>}</Table.Cell>
                    <Table.Cell>{name}</Table.Cell>
                    <Table.Cell>{rank}</Table.Cell>
                    <Table.Cell>{key}</Table.Cell>
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
