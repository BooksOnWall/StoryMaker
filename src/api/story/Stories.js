import React, { Component } from 'react';
import { Progress, Container, Dimmer, Loader, Segment, Header, Table, Icon, Button } from 'semantic-ui-react';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';

import _ from 'lodash';

class Stories extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      server: server,
      stories: server + 'stories',
      column: null,
      data: null,
      direction: null,
      loading: null,
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
    };
    this.handleSort = this.handleSort.bind(this);
    this.listStories = this.listStories.bind(this);
  }
  async listStories() {
    // set loading
    this.setState({loading: true});
    await fetch(this.state.stories, {
      method: 'get',
      headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
    })
    .then(response => {
      if (response && !response.ok) { throw new Error(response.statusText);}
      return response.json();
    })
    .then(data => {
        if(data) {
          this.setState({data: data.stories, loading: false});
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
      await this.listStories();

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
    return this.props.history.push('/stories/'+story.id);
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
                <Loader active={this.state.loading} >
              <FormattedMessage id="app.story.stories.getuser"  defaultMessage={'Get users info'} />
              </Loader>
              </Dimmer>

          <Header as={Segment} vertical size='medium'>
            {<FormattedMessage id="app.user.create" defaultMessage={`Stories`}/>}
            <Link to="/stories/0">
            <Button primary size='large' icon floated='right' >
                <Icon name='plus' />
            </Button>
            </Link>
              </Header>
              <Table inverted stripped="true" selectable sortable>
                <Table.Header className='slide-out' >
                  <Table.Row>
                    <Table.HeaderCell
                      sorted={column === 'id' ? direction : null}
                      onClick={this.handleSort('id')}
                      >
                      <FormattedMessage id="app.story.stories.table.id"  defaultMessage={'Id'} />
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'title' ? direction : null}
                      onClick={this.handleSort('title')}
                      >
                      <FormattedMessage id="app.story.stories.table.title"  defaultMessage={'Title'} />
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'artist' ? direction : null}
                      onClick={this.handleSort('artist')}
                      >
                      <FormattedMessage id="app.story.stories.table.artist"  defaultMessage={'Artist'} />
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'state' ? direction : null}
                      onClick={this.handleSort('state')}
                      >
                      <FormattedMessage id="app.story.stories.table.state"  defaultMessage={'State'} />
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'city' ? direction : null}
                      onClick={this.handleSort('city')}
                      >
                      <FormattedMessage id="app.story.stories.table.city"  defaultMessage={'City'} />
                    </Table.HeaderCell>
                    <Table.HeaderCell>
                      <FormattedMessage id="app.story.stories.table.progress"  defaultMessage={'Progress'} />
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'createdAt' ? direction : null}
                      onClick={this.handleSort('createdAt')}
                      >
                      <FormattedMessage id="app.story.stories.table.create"  defaultMessage={'Created'} />
                    </Table.HeaderCell>
                    <Table.HeaderCell
                      sorted={column === 'updatedAt' ? direction : null}
                      onClick={this.handleSort('updatedAt')}
                      >
                      <FormattedMessage id="app.story.stories.table.updated"  defaultMessage={'Updated'} />
                      </Table.HeaderCell>

                    </Table.Row>
                </Table.Header>
                <Table.Body>
                  {_.map(data, ({ id, title, artist, state, city, createdAt, updatedAt, percent, aa }) => (
                    <Table.Row className='slide-out'  key={id} onClick={() => this.tableRowClickFunc({id})}>
                      <Table.Cell>{id}</Table.Cell>
                      <Table.Cell>{title}</Table.Cell>
                      <Table.Cell>{aa.name}</Table.Cell>
                      <Table.Cell>{state}</Table.Cell>
                      <Table.Cell>{city}</Table.Cell>
                      <Table.Cell><Progress  percent={percent}  progress active indicating inverted /></Table.Cell>
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
export default Stories;
