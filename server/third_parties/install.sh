#!/usr/bin/env bash
## this script should be used fro the root of the project
## ex: sh src/third_parties/install.sh
cd  src/third_parties/
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
