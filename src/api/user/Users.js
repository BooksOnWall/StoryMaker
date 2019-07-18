import React, { Component } from 'react';
import Auth from '../../module/Auth';
import { Table, Icon } from 'semantic-ui-react';

import _ from 'lodash';

class Users extends Component {
  constructor(props) {
    super(props);
    let protocol =  window.location.protocol.replace(/:/g,'');
    protocol = (protocol === 'http') ? 'https' : 'http';
    let domain = protocol + '//' +window.location.hostname;
    let server = domain + ':3010/';
    this.state = {
      server: server,
      login: server + 'login',
      register: server + 'register',
      users: server + 'users',
      column: null,
      data: null,
      direction: null,
      authenticated: false,
      profile: false,
    };
    this.handleSort = this.handleSort.bind(this);
    this.listUsers = this.listUsers.bind(this);
  }
  listUsers() {
    fetch(this.state.users, {
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
        } else {
          console.log('No Data received from the server');
        }
    })
    .catch((error) => {
      // Your error is here!
      console.log(error)
    });
  }
  componentDidMount() {
    // check if user is logged in on refresh
    this.toggleAuthenticateStatus();
    this.listUsers();
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
  render() {
    const { id, name, email, active, column, data, direction } = this.state;
    return (
      <Table sortable celled fixed>
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
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {_.map(data, ({ id, name, email }) => (
            <Table.Row key={id}>
              <Table.Cell>{id}</Table.Cell>
              <Table.Cell>{name}</Table.Cell>
              <Table.Cell>{email}</Table.Cell>
              <Table.Cell>{active ? ( <Icon  name='check' />) : ( <Icon  name='close' />) }</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    );

  }
}
export default Users;
