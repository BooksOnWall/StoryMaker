import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import Auth from '../../module/Auth';
import Profile from './Profile';
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
      profile: false,
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
  edit(id) {
    this.props.history.push('/profile/'+id);
  }
  render() {
    const { id, name, email, active, profile, column, data, direction } = this.state;
    return(
          <Container>
              <segment>
                <Table sortable celled fixed>
                <Table.header>
                  <Table.row>
                    <Table.headercell sorted="{column === 'id' ? direction : null}" onclick="{this.handleSort('id')}">
                      <segment>Users list <link to='{`/profile/0`}' right /><icon name="user"> Add user</icon></segment>
                      Id
                    </Table.headercell>
                    <Table.headercell sorted="{column === 'name' ? direction : null}" onclick="{this.handleSort('name')}">
                      Name
                    </Table.headercell>
                    <Table.headercell sorted="{column === 'email' ? direction : null}" onclick="{this.handleSort('email')}">
                      Email
                    </Table.headercell>
                    <Table.headercell sorted="{column === 'active' ? direction : null}" onclick="{this.handleSort('active')}">
                      Active
                    </Table.headercell>
                    <Table.headercell>
                      Edit
                    </Table.headercell>
                  </Table.row>
                </Table.header>
                <Table.body>
                  {_.map(data, ({ id, name, email, active }) (
                  <Table.row key="{id}">
                    <Table.cell>{id}</Table.cell>
                    <Table.cell>{name}</Table.cell>
                    <Table.cell>{email}</Table.cell>
                    <Table.cell>{active ? ( <icon name="check"/> ) : ( <icon name="close"/> )}</Table.cell>
                    <Table.cell><icon name="edit" to="{`/profle/${id}`}" /><icon name="delete" /></Table.cell>
                  </Table.row>
                  ))}
                </Table.body>
                </Table>
              </segment>
              <Segment id='profil'>
                {this.state.profile ? (<Profile id='profile' />) : null}
                <Profile
                  id='profile'
                />
              </Segment>
          </Container>
    );
  }
}
export default Users;
