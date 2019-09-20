import React, { Component } from 'react';
import { Image, Container, Dimmer, Loader, Segment, Header, Table, Icon, Button, Breadcrumb } from 'semantic-ui-react';
import Moment from 'moment';
import { Link } from 'react-router-dom';
import { injectIntl, FormattedMessage } from 'react-intl';
import _ from 'lodash';

class Users extends Component {
  constructor(props) {
    super(props);
    let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
    let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
    let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
    this.state = {
      server: server,
      login: server + 'login',
      register: server + 'register',
      users: server + 'users',
      column: null,
      data: null,
      direction: null,
      loading: null,
      toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
      authenticated: this.props.childProps.authenticated,
    };
    this.handleSort = this.handleSort.bind(this);
    this.listUsers = this.listUsers.bind(this);
  }
  async listUsers() {
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
      await this.state.toggleAuthenticateStatus;
      await this.listUsers();

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
  tableRowClickFunc(user) {
    return this.props.history.push('/users/'+user.id);
  }
  render() {
    const { column, data, direction } = this.state;
    Moment.locale('en');
    if(data === null) return null;
    return (

    <Container  className="main" fluid>
      <Dimmer active={this.state.loading}>
        <Loader active={this.state.loading} >
          <FormattedMessage id="app.users.loading" defaultMessage={`Get users info`}/>
        </Loader>
      </Dimmer>
      <Segment className="view">
        <Header as='div'>
          <Link to="/users/0">
            <Button secondary animated='vertical' size='medium'>
              <Button.Content hidden>
                  <FormattedMessage id="app.users.adduser" defaultMessage={`Add user`}/>
              </Button.Content>
              <Button.Content visible>
                <Icon name='add user' />
              </Button.Content>
            </Button>
          </Link>
        </Header>
        <Table basic='very' striped sortable selectable>
          <Table.Header className='slide-out'>
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'id' ? direction : null}
                onClick={this.handleSort('id')}
              >
                <FormattedMessage id="app.users.id" defaultMessage={`Id`} />

              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'name' ? direction : null}
                onClick={this.handleSort('name')}
              >
                  <FormattedMessage id="app.users.name" defaultMessage={`Name`} />

              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'email' ? direction : null}
                onClick={this.handleSort('email')}
              >
                  <FormattedMessage id="app.users.email" defaultMessage={`Email`} />

              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'createdAt' ? direction : null}
                onClick={this.handleSort('createdAt')}
              >
                  <FormattedMessage id="app.users.created" defaultMessage={`Created`} />

              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'updatedAt' ? direction : null}
                onClick={this.handleSort('updatedAt')}
              >
                  <FormattedMessage id="app.users.updated" defaultMessage={`Updated`} />

              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'active' ? direction : null}
                onClick={this.handleSort('active')}
                >
                  <FormattedMessage id="app.users.active" defaultMessage={`Active`} />
              </Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>

            {_.map(data, ({ id, name, email, createdAt, updatedAt, active }) => (
              <Table.Row className='slide-out' key={id} onClick={() => this.tableRowClickFunc({id})}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell> <Image src={this.state.server + 'assets/users/' + id + '/avatar.png'} avatar />{name}</Table.Cell>
                <Table.Cell>{email}</Table.Cell>
                <Table.Cell>{Moment(createdAt).format('LLL')}</Table.Cell>
                <Table.Cell>{Moment(updatedAt).format('LLL')}</Table.Cell>
                <Table.Cell>{active ? ( <Icon  name='close' /> ) : ( <Icon  name='check' /> ) }</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>

        </Table>
      </Segment>
    </Container>

    );

  }
}
export default injectIntl(Users);
