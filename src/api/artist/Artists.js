import React, { Component } from 'react';
import Auth from '../../module/Auth';
import { Dimmer, Loader, Segment, Header, Table, Icon, Menu } from 'semantic-ui-react';
import Moment from 'moment';
import { Link } from 'react-router-dom';


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
      authenticated: false,
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
      await this.toggleAuthenticateStatus();
      await this.listArtists();

    } catch(e) {
      console.log(e.message);
    }

  }
  toggleAuthenticateStatus() {
    // check authenticated status and toggle state based on that
    this.setState({ authenticated: Auth.isUserAuthenticated() })
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

      <Segment>
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get users info</Loader>
        </Dimmer>
        <Header as='h6' icon floated='right'>
          <Link to="/artists/0">
            <Icon name='meh' />
            Add Artist
          </Link>
        </Header>
        <Table sortable celled fixed selectable>
          <Table.Header>
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
              <Table.Row key={id} onClick={() => this.tableRowClickFunc({id})}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{name}</Table.Cell>
                <Table.Cell>{email}</Table.Cell>
                <Table.Cell>{description}</Table.Cell>
                <Table.Cell>{Moment(createdAt).format('LLL')}</Table.Cell>
                <Table.Cell>{Moment(updatedAt).format('LLL')}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
           <Table.Row>
             <Table.HeaderCell colSpan='6'>
               <Menu floated='right' pagination>
                 <Menu.Item as='a' icon>
                   <Icon name='chevron left' />
                 </Menu.Item>
                 <Menu.Item as='a'>1</Menu.Item>
                 <Menu.Item as='a'>2</Menu.Item>
                 <Menu.Item as='a'>3</Menu.Item>
                 <Menu.Item as='a'>4</Menu.Item>
                 <Menu.Item as='a' icon>
                   <Icon name='chevron right' />
                 </Menu.Item>
               </Menu>
             </Table.HeaderCell>
           </Table.Row>
         </Table.Footer>
        </Table>
      </Segment>
    );

  }
}
export default Artists;
