#!/bin/bash

# DIRECTORY TO THE REPOSITORY
REPOSITORY="/code/imsukmin/coinoneTelegramBot/"

cd $REPOSITORY

git pull

pm2 restart cbot
