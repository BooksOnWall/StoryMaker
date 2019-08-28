import React, { Component } from 'react';

import {
  Form,
  Select,
  Card,
  Input,
  Label,
  Button,
  Confirm,
  Segment,
  Dimmer,
  Loader,
} from 'semantic-ui-react';

import {  FormattedMessage } from 'react-intl';
import { Formik } from 'formik';
import StorySteps from '../storySteps';
import StageSteps from './stageSteps';
import StageMap from '../map/stageMap';
import StagePictures from './stagePictures';
import ReactHtmlParser from 'react-html-parser';

import { Link } from 'react-router-dom';

const stageOptions = [
  { key: 'Point', value: 'point', text: 'Geo Point' },
  { key: 'linestring', value: 'linestrang', text: 'Line String' },
  { key: 'audio', value: 'audio', text: 'Audio' }
];

class stage extends Component {
  constructor(props) {
      super(props);
      let protocol =  process.env.REACT_APP_SERVER_PROTOCOL;
      let domain = protocol + '://' + process.env.REACT_APP_SERVER_HOST;
      let server = domain + ':'+ process.env.REACT_APP_SERVER_PORT+'/';
      this.state = {
        server: server,
        stories: server + 'stories',
        artists: server + 'artists',
        sid: this.props.sid,
        ssid: (!this.props.match.params.id) ? (0) : (parseInt(this.props.match.params.id)),
        mode: (parseInt(this.props.match.params.id) === 0) ? ('create') : ('update'),
        name: null,
        stages: '/stories/' + this.props.match.params.id + '/stages',
        stageURL: server + 'stories/' + this.props.match.params.id + '/stages/' + parseInt(this.props.match.params.id),
        map:  '/stories/' +  + '/map',
        loading: null,
        step: 'Stages',
        stageLocation: null,
        setSteps: this.setSteps,
        setStageLocation: this.setStageLocation,
        toggleAuthenticateStatus: this.props.childProps.toggleAuthenticateStatus,
        authenticated: this.props.childProps.authenticated,
      };
  }
  setStageLocation = (lngLat) => {
    console.log(lngLat);
    this.setState({stageLocation: lngLat});
  }
  onChangeHandler = (e) => {
    this.setState({stagePictures: e.files})
  }
  setPictures = (e) => {
    this.setState({stagePictures: e.files})
  }
  componentDidMount= async () => {
    try {
      await this.getStage();
    } catch(e) {
      console.log(e.message);
    }
  }
  editStage = () => {
    return (
      <Segment>
        <Segment>
          <Formik
            enableReinitialize={true}
            initialValues={this.state.initialSValues}
            validate={values => {
              let errors = {};
              return errors;
            }}
            onSubmit={(values, { setSubmitting }) => {
              if(this.state.mode === 'update') {
                //    this.updateStage(values);
              } else {
                //  this.createStage(values);
              }

              setTimeout(() => {
                //alert(JSON.stringify(values, null, 2));

                setSubmitting(false);
              }, 400);
            }}
            >
            {({
              values,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              handleDelete,
              isSubmitting,
              /* and other goodies */
            }) => (

              <Form  onSubmit={this.handleSubmit}>
                <Input
                  fluid
                  placeholder='Name'
                  label='Name'
                  autoFocus={true}
                  type="text"
                  name="name"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={values.name}
                  />
                {errors.name && touched.name && errors.name}

                <Input
                  fluid
                  placeholder='calle, barrio, ciudad, pays'
                  label='Adress'
                  type="text"
                  name="adress"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  defaultValue={values.adress}
                  />
                {errors.adress && touched.adress && errors.adress}

                <Input
                  fluid
                  label='Stage Location'
                  placeholder='Stage Location'
                  type="text"
                  name="stagelocation"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={JSON.stringify(this.state.stageLocation)}
                  />
                {errors.stagelocation && touched.stagelocation && errors.stagelocation}

                <Label>Stage type</Label><Select
                  placeholder='Stage type'
                  label='Stage type'
                  type="text"
                  name="stagetype"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  options={stageOptions}
                  defaultValue={values.stagetype}
                  />
                {errors.stagetype && touched.stagetype && errors.stagetype}

                <Button onClick={handleSubmit} floated='right'color='violet'  size='large' type="submit" disabled={isSubmitting}>
                  {(this.state.mode === 'create') ? 'Create' : 'Update'}
                </Button>
                {(this.state.mode === 'update') ? (
                  <div>
                    <Button onClick={this.show} color='red'  size='large' type="submit" disabled={isSubmitting}>
                      <FormattedMessage id="app.story.delete" defaultMessage={`Delete stage`}/>
                    </Button>
                    <Confirm
                      open={this.state.open}
                      cancelButton='Never mind'
                      confirmButton="Delete Story"
                      onCancel={this.handleCancel}
                      onConfirm={this.handleDelete}
                      />
                  </div>
                ) : '' }
              </Form>
            )}
          </Formik>
        </Segment>
        <Segment.Group horizontal>
        <Segment ><StageMap setStageLocation={this.state.setStageLocation} stageLocation={this.state.stageLocation}/></Segment>
        <Segment>
          <Card
            color='violet'
            header={this.state.name}
            description={ReactHtmlParser(this.state.description)}
          />
        </Segment>
        </Segment.Group>
      <Segment.Group horizontal>
          <Segment>
            <StagePictures onChangeHandler={this.onChangeHandler} setPictures={this.setPictures}/>
          </Segment>
          <Segment  className="stage">

          </Segment>
        </Segment.Group>
      </Segment>
    );
  }
  async getStage() {
    this.setState({loading: true});
    try {
      await fetch(this.state.stageURL, {
        method: 'get',
        headers: {'Access-Control-Allow-Origin': '*', credentials: 'same-origin', 'Content-Type':'application/json'}
      })
      .then(response => {
        if (response && !response.ok) { throw new Error(response.statusText);}
        return response.json();
      })
      .then(data => {
          if(data) {
            this.setState({
              id: data.id,
              sid: data.sid,
              name: data.name,
              adress: data.adress,
              pictures: data.pictures,
              type: data.type,
              description: data.description,
              geometry: data.geometry,
              stageLocation: data.geometry.coordinates,
            });
            this.setState({initialSValues: data});
            this.setState({loading: false});
            return data;
          } else {
            console.log('No Data received from the server');
          }
      })
      .catch((error) => {
        // Your error is here!
        console.log({error})
      });
    } catch(e) {
      console.log(e.message);
    }
  }
  render() {
    return (
      <Segment className="view" >
        <Dimmer active={this.state.loading}>
          <Loader active={this.state.loading} >Get stage info</Loader>
        </Dimmer>
        <StorySteps step={this.state.step} state={this.state}/>
        <StageSteps step={this.state.step} state={this.state}/>
        {(this.state.ssid >0) ? this.editStage() : ''}
      </Segment>
    );
  }
}
export default stage;
