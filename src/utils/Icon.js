// icon.js
import React from "react";
import IcoMoon from "react-icomoon";
const iconSet = require("../semantic-ui/site/assets/fonts/selection.json");

const Icon = ({ ...props }) => {
  return <IcoMoon iconSet={iconSet} {...props} />;
};

export default Icon;
