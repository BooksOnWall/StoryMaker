#!/usr/bin/env bash
echo "building Books On Wall "
yarn build 
cp .htaccess build/.htaccess
echo "build complete"


