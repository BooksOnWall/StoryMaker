import React, { Component } from 'react';
import { Progress, Container, Dimmer, Loader, Segment, Header, Table, Icon, Button } from 'semantic-ui-react';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import _ from 'lodash';

class Stats extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      server: server,
      stats: server + 'stats',
      column: null,
      data: null,
      direction: null,
      loading: null,
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
    };
    this.handleSort = this.handleSort.bind(this);
    this.listStats = this.listStats.bind(this);
  }
  async listStats() {
    // set loading
    this.setState({loading: true});
    await fetch(this.state.stats, {
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
          this.setState({data: data.stats, loading: false});
        } else {
          console.log('No Data received from the server');
        }
    })
    .catch((error) => {
      // Your error is here!
      //console.log(error)
    });
  }

  async componentDidMount() {
    // check if user is logged in on refresh
    try {
      await this.state.toggleAuthenticateStatus;
      await this.listStats();

    } catch(e) {
      console.log(e.message);
    }

  }
  handleSort = clickedColumn => () => {
    const { column, data, direction } = this.state;

    if (column !== clickedColumn) {
      this.setState({
        column: clickedColumn,
        data: _.sortBy(data, [clickedColumn]),
        direction: 'ascending',
      });

      return
    }
    this.setState({
      data: data.reverse(),
      direction: direction === 'ascending' ? 'descending' : 'ascending',
    });
  }
  tableRowClickFunc(story) {
    return this.props.history.push('/stats/'+story.id);
  }
  render() {
    const { column, data, direction } = this.state;
    Moment.locale('en');
    if(data === null) return null;
    return (

    <Container className="main" fluid>
      <Dimmer.Dimmable as={Segment} inverted className="view" blurring dimmed={this.state.loading}>
          <Dimmer active={this.state.loading} onClickOutside={this.handleHide} />
              <Dimmer active={this.state.loading}>
                <Loader className='loader' active={this.state.loading} >
              <FormattedMessage id="app.story.stats.getuser"  defaultMessage={'Get users info'} />
              </Loader>
              </Dimmer>
              <Table inverted stripped="true" selectable sortable>
                <Table.Header className='slide-out' >
                  <Table.Row>
                    <Table.HeaderCell
                      sorted={column === 'id' ? direction : null}
                      onClick={this.handleSort('id')}
                      >
                      <FormattedMessage id="app.story.stats.table.id"  defaultMessage={'Id'} />
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'sid' ? direction : null}
                      onClick={this.handleSort('sid')}
                      >
                      Story id
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'ssid' ? direction : null}
                      onClick={this.handleSort('ssid')}
                      >
                      Stage id
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'name' ? direction : null}
                      onClick={this.handleSort('name')}
                      >
                      Name
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      Values
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      Data
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'createdAt' ? direction : null}
                      onClick={this.handleSort('createdAt')}
                      >
                      <FormattedMessage id="app.story.stats.table.create"  defaultMessage={'Created'} />
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'updatedAt' ? direction : null}
                      onClick={this.handleSort('updatedAt')}
                      >
                      <FormattedMessage id="app.story.stats.table.updated"  defaultMessage={'Updated'} />
                      </Table.HeaderCell>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                  {_.map(data, ({ id, sid, ssid, name, values, data, createdAt, updatedAt }) => (
                    <Table.Row className='slide-out'  key={id} onClick={() => this.tableRowClickFunc({id})}>
                      <Table.Cell>{id}</Table.Cell>
                      <Table.Cell>{sid}</Table.Cell>
                      <Table.Cell>{ssid}</Table.Cell>
                      <Table.Cell>{values}</Table.Cell>
                      <Table.Cell>{data}</Table.Cell>
                      <Table.Cell>{Moment(createdAt).format('LL')}</Table.Cell>
                      <Table.Cell>{Moment(updatedAt).format('LL')}</Table.Cell>
                    </Table.Row>
                  ))}
                </Table.Body>
              </Table>
        </Dimmer.Dimmable>
      </Container>

    );

  }
}
export default Stats;
