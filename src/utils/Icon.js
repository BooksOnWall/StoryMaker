// icon.js
import React from "react";
import IcoMoon from "react-icomoon";
const iconSet = require("../assets/nav/selection.json");

const CustomIcon = ({ ...props }) => {
  return <IcoMoon iconSet={iconSet} {...props} />;
};

export default CustomIcon;
