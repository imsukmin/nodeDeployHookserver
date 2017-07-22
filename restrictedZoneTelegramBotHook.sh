#!/bin/bash

# DIRECTORY TO THE REPOSITORY
REPOSITORY="/code/imsukmin/telegramBot/"

cd $REPOSITORY

git pull

pm2 restart tbot
