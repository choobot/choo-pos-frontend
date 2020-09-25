# choo-pos-frontend

## Note
- Frontend Repo: https://github.com/choobot/choo-pos-backend
- Backend Repo: https://github.com/choobot/choo-pos-backend

## Live Demo
- https://choo-pos.herokuapp.com

## Additional features from requirements
- User can use Barcode Scanner to scan a product barcode instead of select a product (we can simulate it by fill in a product id from [book.json](https://json-bin.netlify.app/books.json) and press enter key)
- User can use keyboard shortcuts (after login)
    - CTRL + O : L<ins>o</ins>gout
    - CTRL + C : <ins>C</ins>heckout Mode
    - CTRL + L : <ins>L</ins>ogs Mode
    - CTRL + S : <ins>S</ins>ales Orders Mode    
    - CTRL + P : Cart <ins>P</ins>ayment
    - CTRL + R : Cart <ins>R</ins>eset
    - CTRL + N : <ins>N</ins>ext Order (after Payment)
- Display ribbon on promotion products only, user can hover to see a promotion detail
- After payment, order will be created via API
- Customer can scan QR Code to get E-Receipt
- Sales Order history

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
- vue-shortkey
- Jest
- Axios
- Bootstrap
- Numeral
- qrcode.vue
- Babel
- Webpack
- Docker
- Heroku