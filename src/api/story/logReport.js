import React, { Component } from 'react';

import {
  Icon,
  Message,
  Menu,
  Image,
  Label,
  Tab,
} from 'semantic-ui-react';

// const listItems = (this.props.logs)
// ? props.logs.map((number) => <List.Item>{number.condition} <Icon name={number.condition} /><List.Item>
// : null;


class logReport extends Component  {
  constructor(props) {
      super(props);
      let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
      let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
      let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';

        this.state = {
          server: server,
          logs: null,
          tabs: null,
        };
  }
  renderImageList = (list) => {
    return (
      <Message.Item><Image.Group size="tiny">{ list.map((img, index) => (img.src) ? <Image key={index}  src={this.state.server+img.src} /> : '') }</Image.Group></Message.Item>
    );
  }
  renderItems =  (items, category) => {
    return (
        items.map((log, index) => (log.category === category) ? (
          <Message key={log.category+index}  icon color={(log.check) ? 'green' : 'red'}>
          {(log.check) ? <Icon name='check' /> : <Icon name='bug' /> }
          {(log.src) ? <Image   size="small" src={log.src}/> : ''}
          <Message.Content>
            <Message.Header>{log.condition}</Message.Header>
            <Message.List>
            {(!log.check && typeof(log.error) === 'string') ? <Message.Item>{log.error}</Message.Item> : '' }
            {(!log.check && log.category==='pictures' && log.error && typeof(log.error) === 'object') ?  this.renderImageList(log.error) : '' }
            </Message.List>
          </Message.Content>
          </Message> ) : null )
    );
  }
  renderTabHeader = (items, category) => {
    let error = 0;
    let win = 0;
    items.map((log, index) => {
      if(log.category === category) {
        (log.check === true) ? win ++ : error ++;
      }
      return log;
    });
    let err = (error > 0) ? <Label size="tiny" circular color="red" >{error}</Label>: '';
    let sucess = (win > 0) ? <Label size="tiny" circular color="green" >{win}</Label>: '';
    return <Menu.Item key={category +'messages'}>{err} {sucess} {category.charAt(0).toUpperCase() + category.slice(1)} </Menu.Item>;

  }
  buildTab = () => {
    let logs = this.props.logs;
    let tabs = [
      {
        menuItem: this.renderTabHeader(logs, 'photo'),
        pane: {key: 'photo', content: this.renderItems(logs, 'photo')}
      },
      {
        menuItem: this.renderTabHeader(logs, 'description'),
        pane: {key: 'description', content: this.renderItems(logs, 'description')}
      },
      {
        menuItem: this.renderTabHeader(logs, 'pictures'),
        pane:  {key: 'pictures', content: this.renderItems(logs, 'pictures')}
      },
      {
        menuItem: this.renderTabHeader(logs, 'onZoneEnter'),
        pane:  {key: 'onZoneEnter', content: this.renderItems(logs, 'onZoneEnter')}
      },
      {
        menuItem: this.renderTabHeader(logs, 'onPictureMatch'),
        pane:  {key: 'onPictureMatch', content: this.renderItems(logs, 'onPictureMatch')}
      },
      {
        menuItem: this.renderTabHeader(logs, 'onZoneLeave'),
        pane:  {key: 'onZoneLeave', content: this.renderItems(logs, 'onZoneLeave')}
      },
      {
        menuItem: this.renderTabHeader(logs, 'json'),
        pane: {key: 'json', content: this.renderItems(logs, 'json')}
      }
    ];
    this.setState({logs: logs, tabs: tabs});
  }
  componentDidMount = () => {
    this.buildTab();
  }

   render() {

     return (
       <Tab
         key="preflight"
         renderActiveOnly={false}
         menu={{ color: 'black', inverted: true, attached: false, borderless: true, tabular: false , fluid: false, vertical: true }}
         menuPosition='right'
         panes={this.state.tabs}
       />
     );
   }
}
export default logReport;
