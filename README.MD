# Nodejs Hapi API

This repository contains the implementation for simple e-commerce API based on [jubelio store](https://codetesting.jubelio.store/) data

## ERD
![erd](https://github.com/nmmugia/nodejs-hapi-api/blob/master/public/erd.png?raw=true)

# Structure
![structure](https://github.com/nmmugia/nodejs-hapi-api/blob/master/public/structure.png?raw=true)


## API docs
[Postman link](https://github.com/nmmugia/nodejs-hapi-api/blob/master/public/api-postman.json?raw=true)

## Installation using docker (recommended)

```bash
docker-compose up
```
### Note
you may change the configuration/environments that is set, on docker-compose file

## Scripts
### compile in watch mode
```
yarn tsc
```
### serve the backend app
```
yarn serve
```
### compile and migrate the database migration
```
yarn migrate
```

## License

[MIT](https://choosealicense.com/licenses/mit/)