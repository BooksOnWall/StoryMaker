#!/usr/bin/env bash
echo "Checking updates"
git pull
yarn
cd server 
yarn
cd ../
echo "building Books On Wall "
yarn build 
echo "adding htaccess en build directory" 
cp _htaccess build/.htaccess
echo "build complete"
