import React, { Component } from 'react';
import Auth from '../../module/Auth';
import {
  Container,
  Segment,
  Table,
  Icon,
} from 'semantic-ui-react';
import _ from 'lodash';


class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      column: null,
      data: null,
      direction: null,
      authenticated: false,
      users: 'http://localhost:3010/users',
    };
    this.handleSort = this.handleSort.bind(this);
    this.listUsers = this.listUsers.bind(this);
  }
  listUsers() {
    fetch(this.state.users, {
      method: 'get',
      headers: {credentials: 'same-origin', 'Content-Type':'application/json'}
    })
    .then(response => {
      if (response && !response.ok) { throw new Error(response.statusText);}
      return response.json();
    })
    .then(data => {
        if(data) {
          console.log(data);
          this.setState({data: data});
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
    const { column, data, direction } = this.state;
    console.log(data);
    return(
        <Container>
          <Segment.Group>
            <Segment>Users</Segment>
            <Segment>
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
                   <Table.HeaderCell
                     sorted={column === 'active' ? direction : null}
                     onClick={this.handleSort('active')}
                   >
                     Active
                   </Table.HeaderCell>
                   <Table.HeaderCell
                     sorted={column === 'active' ? direction : null}
                     onClick={this.handleSort('edit')}
                   >
                     Edit
                   </Table.HeaderCell>
                 </Table.Row>
               </Table.Header>
               <Table.Body>
                 {_.map(data, ({ id, name, email, active }) => (
                   <Table.Row key={id}>
                     <Table.Cell>{id}</Table.Cell>
                     <Table.Cell>{name}</Table.Cell>
                     <Table.Cell>{email}</Table.Cell>
                     <Table.Cell>{active ? ( <Icon name='check' /> ) : ( <Icon name='close' /> )}</Table.Cell>
                     <Table.Cell><Icon name='edit' /><Icon name='delete' /></Table.Cell>
                   </Table.Row>
                 ))}
               </Table.Body>
             </Table>

            </Segment>
          </Segment.Group>
        </Container>
    );
  }
}
export default Users;
