import React, { Component } from 'react';
import { Container, Dimmer, Loader, Segment, Header, Table, Icon, Button } from 'semantic-ui-react';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';


import _ from 'lodash';

class Artists extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      server: server,
      users: server + 'artists',
      column: null,
      data: null,
      direction: null,
      loading: null,
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
      profile: false,
    };
    this.handleSort = this.handleSort.bind(this);
    this.listArtists = this.listArtists.bind(this);
  }
  async listArtists() {
    // set loading
    this.setState({loading: true});
    await fetch(this.state.users, {
      method: 'get',
      headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
    })
    .then(response => {
      if (response && !response.ok) { throw new Error(response.statusText);}
      return response.json();
    })
    .then(data => {
        if(data) {
          this.setState({data: data});
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

  async componentDidMount() {
    // check if user is logged in on refresh
    try {
        await this.listArtists();

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
  tableRowClickFunc(artist) {
    return this.props.history.push('/artists/'+artist.id);
  }
  render() {
    const { column, data, direction } = this.state;
    Moment.locale('en');
    if(data === null) return null;
    return (
    <Container className="main" fluid>
      <Segment inverted className="view" >
        <Dimmer active={this.state.loading}>
          <Loader className='loader' active={this.state.loading} >Get users info</Loader>
        </Dimmer>
        <Header as={Segment} vertical size='large'>
            {<FormattedMessage id="app.artists.title" defaultMessage={`Artists`}/>}
          <Link to="/artists/0">
            <Button primary size='small' icon floated='right' >
                <Icon name='plus' />
            </Button>
          </Link>
        </Header>
          <Table inverted striped selectable sortable>
          <Table.Header className='slide-out' >
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'id' ? direction : null}
                onClick={this.handleSort('id')}
              >
                Id
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={this.handleSort('name')}
              >
                Name
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'email' ? direction : null}
                onClick={this.handleSort('email')}
              >
                Email
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'description' ? direction : null}
                onClick={this.handleSort('description')}
              >
                Description
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'createdAt' ? direction : null}
                onClick={this.handleSort('createdAt')}
              >
                Created
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'updatedAt' ? direction : null}
                onClick={this.handleSort('updatedAt')}
              >
                Updated
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {_.map(data, ({ id, name, email, createdAt, updatedAt, description }) => (
              <Table.Row className='slide-out' key={id} onClick={() => this.tableRowClickFunc({id})}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{email}</Table.Cell>
                <Table.Cell>{description}</Table.Cell>
                <Table.Cell>{Moment(createdAt).format('LLL')}</Table.Cell>
                <Table.Cell>{Moment(updatedAt).format('LLL')}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

        </Table>
       </Segment>
      </Container>

    );

  }
}
export default Artists;
