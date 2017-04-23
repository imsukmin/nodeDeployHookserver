#!/bin/bash

# DIRECTORY TO THE REPOSITORY
REPOSITORY="~/code/telegramBot/"

cd $REPOSITORY

git pull

pm2 restart tBot
