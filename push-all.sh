#!/bin/bash
git push --all
VERSION=$(cat version)
git push origin $VERSION
sleep 5
bash pull.sh