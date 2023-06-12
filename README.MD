# Nodejs Hapi API

This repository contains the implementation for simple e-commerce API based on [jubelio store](https://codetesting.jubelio.store/) data

## ERD
![erd](https://github.com/nmmugia/nodejs-hapi-api/blob/master/public/erd.png?raw=true)
### note on ERD
So while the product and adjustment_transaction are quite straightforward, but on the product_stock, we use irreversible historical-based data, means that every stock move must be recorded and had to be sequential (old data should not be updated directly since it tampered with the data consistency).

Why we do this rather than just adding qty column and update it directly? because, for example, as a business owner, I want to know the historical data to make sure it's consistent and to make sure there are no data tampering from employee or another person

# Structure
![structure](https://github.com/nmmugia/nodejs-hapi-api/blob/master/public/structure.png?raw=true)


## API docs
[Postman link](https://github.com/nmmugia/nodejs-hapi-api/blob/master/public/api-postman.json?raw=true)

## Installation using docker (recommended)

```bash
docker-compose up
```

## Installation using yarn

```bash
yarn install
yarn tsc
yarn migrate
yarn serve
```
### Requirements (without docker)
- Postgresql
- Redis


### Note
you may change the configuration/environments that is set, on docker-compose file

## Scripts
### compile to js
```
yarn tsc
```
### compile and migrate the database migration
```
yarn migrate
```
### serve the backend app
```
yarn serve
```

## License

[MIT](https://choosealicense.com/licenses/mit/)