import React, { Component } from 'react';


import {
  Segment,
  Table,
  Icon
} from 'semantic-ui-react';
import ReactDragListView  from 'react-drag-listview';
import { FormattedMessage } from 'react-intl';
import _ from 'lodash';
import Moment from 'moment';

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
      direction: null,
      sid: parseInt(this.props.sid),
      mode: (parseInt(this.props.sid) === 0) ? ('create') : ('update'),
    };
    this.columns = [
      {
        title: "Key",
        dataIndex: "key"
      },
      {
        title: "Name",
        dataIndex: "name"
      },
      {
        title: "Gender",
        dataIndex: "gender"
      },
      {
        title: "Age",
        dataIndex: "age"
      },
      {
        title: "Address",
        dataIndex: "address"
      },
      {
        title: "Operates",
        key: "operate",
        render: (text, record, index) =>
        <a className="drag-handle" href="/">Drag</a>
      }
    ];
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

  }

  tableRowClickFunc(user) {
  //  return this.props.history.push('/users/'+user.id);
  }
  render() {
    return (
      <Segment  className="view stages">
        <h2>Table row with dragging</h2>
                <ReactDragListView {...this.dragProps}>
                  <Table sortable celled fixed >
                    <Table.Header className='slide-out'>
                      <Table.Row>
                        <Table.HeaderCell >
                          <FormattedMessage id="app.stage.id" defaultMessage={`Id`} />
                        </Table.HeaderCell>
                        <Table.HeaderCell >
                            <FormattedMessage id="app.stage.name" defaultMessage={`Name`} />
                        </Table.HeaderCell>
                        <Table.HeaderCell   >
                            <FormattedMessage id="app.stage.image" defaultMessage={`Image`} />
                        </Table.HeaderCell>
                        <Table.HeaderCell   >
                            <FormattedMessage id="app.stage.created" defaultMessage={`Created`} />
                        </Table.HeaderCell>
                        <Table.HeaderCell   >
                            <FormattedMessage id="app.stage.updated" defaultMessage={`Updated`} />
                        </Table.HeaderCell>
                        <Table.HeaderCell   >
                            <FormattedMessage id="app.stage.rank" defaultMessage={`rank`} />
                        </Table.HeaderCell>
                        <Table.HeaderCell   >
                            <FormattedMessage id="app.stage.drag" defaultMessage={`Drag me`} />
                        </Table.HeaderCell>
                      </Table.Row>
                    </Table.Header>
                    <Table.Body>

                      {_.map(this.state.data, ({ key, name, image, createdAt, updatedAt, rank }) => (
                        <Table.Row className='slide-out' key={key} onClick={() => this.tableRowClickFunc({key})}>
                          <Table.Cell>{key}</Table.Cell>
                          <Table.Cell>{name}</Table.Cell>
                          <Table.Cell>{image}</Table.Cell>
                          <Table.Cell>{Moment(createdAt).format('LLL')}</Table.Cell>
                          <Table.Cell>{Moment(updatedAt).format('LLL')}</Table.Cell>
                          <Table.Cell>{rank}</Table.Cell>
                          <Table.Cell>{<a className="drag-handle" href="void(0)">Drag</a>}</Table.Cell>
                        </Table.Row>
                      ))}
                    </Table.Body>
                  </Table>
                </ReactDragListView>
      </Segment>
    );
  }
}
export default storyStages;
