import React, { Component } from 'react';
import { Container, Dimmer, Loader, Segment, Header, Table, Icon, Menu } from 'semantic-ui-react';
import Moment from 'moment';
import { Link } from 'react-router-dom';


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

    <Container className="view" fluid>
      <Segment style={{fontSize: '.9em'}}>
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get users info</Loader>
        </Dimmer>
        <Header as='h6' icon floated='right'>
          <Link to="/stories/0">
            <Icon name='sun' />
            Add Story
          </Link>
        </Header>
        <Table sortable celled fixed selectable>
          <Table.Header className='slide-out' >
            <Table.Row>
              <Table.HeaderCell
                sorted={column === 'id' ? direction : null}
                onClick={this.handleSort('id')}
              >
                Id
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'title' ? direction : null}
                onClick={this.handleSort('title')}
              >
                Title
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'artist' ? direction : null}
                onClick={this.handleSort('artist')}
              >
                Artist
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'state' ? direction : null}
                onClick={this.handleSort('state')}
              >
                State
              </Table.HeaderCell>
              <Table.HeaderCell
                sorted={column === 'city' ? direction : null}
                onClick={this.handleSort('city')}
              >
                City
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
            {_.map(data, ({ id, title, artist, state, city, createdAt, updatedAt }) => (
              <Table.Row className='slide-out'  key={id} onClick={() => this.tableRowClickFunc({id})}>
                <Table.Cell>{id}</Table.Cell>
                <Table.Cell>{title}</Table.Cell>
                <Table.Cell>{artist}</Table.Cell>
                <Table.Cell>{state}</Table.Cell>
                <Table.Cell>{city}</Table.Cell>
                <Table.Cell>{Moment(createdAt).format('LLL')}</Table.Cell>
                <Table.Cell>{Moment(updatedAt).format('LLL')}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
          <Table.Footer>
           <Table.Row>
             <Table.HeaderCell colSpan='6'>
               <Menu floated='right' pagination>
                 <Menu.Item as={Link} icon>
                   <Icon name='chevron left' />
                 </Menu.Item>
                 <Menu.Item as={Link}>1</Menu.Item>
                 <Menu.Item as={Link}>2</Menu.Item>
                 <Menu.Item as={Link}>3</Menu.Item>
                 <Menu.Item as={Link}>4</Menu.Item>
                 <Menu.Item as={Link} icon>
                   <Icon name='chevron right' />
                 </Menu.Item>
               </Menu>
             </Table.HeaderCell>
           </Table.Row>
         </Table.Footer>
        </Table>
      </Segment>
      </Container>

    );

  }
}
export default Stories;
