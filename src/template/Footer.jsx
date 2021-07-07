import React, { useState } from 'react';
//import {  Box, Menu, Grid, Icon, Breadcrumb, Divider } from 'semantic-ui-react';
import {Paper,MenuList, Button,  Container,  Link, Box, Typography, Breadcrumbs, MenuItem, Grid, Divider} from '@material-ui/core';
import {makeStyles} from '@material-ui/styles';
import { useHistory, useLocation } from "react-router-dom";
import { useReactive } from '../utils/reactive';
import clsx from 'clsx';
import Heart from '@material-ui/icons/Favorite';
import Cc from '@material-ui/icons/ClosedCaption';
import FacebookIcon from '@material-ui/icons/Facebook';
import InstagramIcon from '@material-ui/icons/Instagram';
import TwitterIcon from '@material-ui/icons/Twitter';

import LinkedInIcon from '@material-ui/icons/LinkedIn';
import YouTubeIcon from '@material-ui/icons/YouTube';
import CloudIcon from '@material-ui/icons/Cloud';
import GitHubIcon from '@material-ui/icons/GitHub';
import TelegramIcon from '@material-ui/icons/Telegram';

import { ReactComponent as LogoIcon }   from './../assets/images/logo.svg';

import { injectIntl, defineMessages } from 'react-intl';

const footerTraductions = defineMessages({
  thx_for_support_us: {
    id: 'footer.thx_for_support_us',
    defaultMessage: "Thx for supporting us"
  },
  terms: {
    id: 'footer.terms',
    defaultMessage: "Terms"
  },
});

const useStyles = makeStyles((theme) => ({
  root: {
    flex:1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    flexWrap: 'wrap'
  },

}));


const Footer = ({intl}) => {

    return (<>
      <Box >

      </Box>
      </>
    )
};

export default injectIntl(Footer);
