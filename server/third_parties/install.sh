#!/usr/bin/env bash
## this script should be used fro the root of the project
## ex: sh server/third_parties/install.sh
cd  server/third_parties/
pwd
echo "Checking arcoreimg"
echo "Downloading arcore-android-sdk"
git clone https://github.com/google-ar/arcore-android-sdk.git
mkdir -p google
mv arcore-android-sdk/tools/arcoreimg google/.
echo "Set permissions"
chmod -R 755 google/arcoreimg
echo "Remove arcore-android-sdk"
rm -rf arcore-android-sdk
echo "arcoreimg installed"
