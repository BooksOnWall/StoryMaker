#!/usr/bin/env bash
echo "Checking updates"
yarn
echo "building Books On Wall "
yarn build
cp _htaccess build/.htaccess
echo "build complete"
