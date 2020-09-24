#!/bin/sh

source .env

docker-compose up --build

./sync-package.json.sh