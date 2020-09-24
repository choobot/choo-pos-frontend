#!/bin/sh

source .env

heroku container:login
heroku container:push web --arg API_ENDPOINT=${PROD_API_ENDPOINT} --app=$HEROKU_APP
heroku container:release web --app=$HEROKU_APP