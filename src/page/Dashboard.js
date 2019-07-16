import React from 'react';
import PropTypes from 'prop-types';

import { Card } from 'semantic-ui-react';
const Dashboard = ({ secretData, user }) => (
  <Card
    header = 'Dashboard'
    description = 'You should get access to this page only after authentication.'

  />

);

Dashboard.propTypes = {
  secretData: PropTypes.string.isRequired
};

export default Dashboard;
