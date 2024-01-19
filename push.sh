#!/bin/bash
git push
VERSION=$(cat version)
git tag $VERSION
git push origin $VERSION