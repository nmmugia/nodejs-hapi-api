require('dotenv').config();

module.exports = {
    development: {
      client: 'postgresql',
      connection: {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        user: process.env.POSTGRES_USERNAME,
        password: process.env.POSTGRES_PASSWORD,
        database: process.env.POSTGRES_DB,
      },
      migrations: {
        directory: './dist/migrations',
      }
    },
  };
  