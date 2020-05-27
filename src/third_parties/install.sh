#!/usr/bin/env bash
## this script should be used fro the root of the project
## ex: sh src/third_parties/install.sh
cd  src/third_parties/
echo "Checking arcoreimg"
echo "Download arcore-android"
git clone https://github.com/google-ar/arcore-android-sdk.git
pwd
mkdir -p google
mv arcore-android-sdk/tools/arcoreimg google/.
rm -rf arcore-android-sdk
echo "arcoreimg installed"
