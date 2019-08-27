import React, { Component } from 'react';

import {
  Form,
  Select,
  Divider,
  Input,
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

import { Link } from 'react-router-dom';

const stageOptions = [
  { key: 'text', value: 'text', text: 'Text Wall' },
  { key: 'ar', value: 'ar', text: 'Augmented Reality' },
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
        map:  '/stories/' + this.props.match.params.id + '/map',
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
  editStage = () => {
    return (
      <Segment>
        <StageMap setStageLocation={this.state.setStageLocation} stageLocation={this.state.stageLocation}/>
        <Segment.Group horizontal>
          <Segment>
            <StagePictures onChangeHandler={this.onChangeHandler} setPictures={this.setPictures}/>
          </Segment>
          <Segment  className="story">
            <Formik
              enableReinitialize={true}
              initialValues={this.state.initialStageValues}
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
                    placeholder='Adress'
                    label='Adress'
                    type="text"
                    name="adress"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    defaultValue={values.adress}
                    />
                  {errors.adress && touched.adress && errors.adress}


                  <Select
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
                  <Input
                    label='Stage Location'
                    placeholder='Stage Location'
                    type="text"
                    name="stagelocation"
                    onChange={handleChange}
                    onBlur={handleBlur}
                    value={JSON.stringify(this.state.stageLocation)}
                    />
                  {errors.stagelocation && touched.stagelocation && errors.stagelocation}
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
        </Segment.Group>
      </Segment>
    );
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
