#!/usr/bin/env bash
git pull 
yarn 
yarn build
chown -R www-data:www-data public
