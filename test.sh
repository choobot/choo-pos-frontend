#!/bin/sh

source .env

docker-compose exec vuejs "/bin/sh" "-c" "npm run unit"