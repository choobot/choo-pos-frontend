# choo-pos-frontend

## Note
- Frontend Repo: https://github.com/choobot/choo-pos-backend
- Backend Repo: https://github.com/choobot/choo-pos-backend

## Live Demo
- https://choo-pos.herokuapp.com

## Prerequisites for Development
- Mac or Linux which can run shell script
- Docker
- Heroku CLI (for Production Deployment only)

## Local Running for Development
- To enable Webpack Hot Reloading on Web Browser (via WebSocket), please config host mapping in `/etc/hosts` to have `127.0.0.1	vuejs`
- Config environment variables in `.env`
- `$ ./dev.sh`

## Unit Testing
- Running locally (see above)
- `$ ./test.sh`

## Production Deployment
- Create Heroku App in Heroku Dashboard
- Config environment variables in .env
- `$ ./prod.sh`

## Tech Stack
- Vue
- Vue Test Utils
- Jest
- Axios
- Bootstrap
- Numeral
- Babel
- Webpack
- Docker
- Heroku