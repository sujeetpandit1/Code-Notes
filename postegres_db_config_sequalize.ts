import { Sequelize, ConnectionAcquireTimeoutError } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize({
  database: process.env.DATABASE_URI,
  username: process.env.USERNAME_URI,
  password: process.env.PASSWORD_URI,
  host: process.env.HOST_URI,
  port: Number(process.env.PORT_URI),
  dialect: 'postgres',
  logging: false,
  // dialectOptions: {
  //   ssl: {
  //     require: true,
  //     rejectUnauthorized: false,
  //   },
  // },
  pool: {
    max: 10, 
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});


async function connectWithRetry() {
  let retries = 3; 

  while (retries > 0) {
    try {
      await sequelize.authenticate();
      console.log('Database connection established');
      return; 
    } catch (err) {
      if (err instanceof ConnectionAcquireTimeoutError) {
        console.error('Connection timeout error:', err);
        retries--; 
        console.log(`Retrying connection. ${retries} retries left.`);
        await new Promise((resolve) => setTimeout(resolve, 5000)); 
        console.error('Unable to connect to the database:', err);
        break;
      }
    }
  }

  console.error('Maximum number of retries reached. Unable to establish database connection.');
  // Return a custom error message or throw an error here
  throw new Error('Unable to establish connection.');
}

connectWithRetry();

export default sequelize;
