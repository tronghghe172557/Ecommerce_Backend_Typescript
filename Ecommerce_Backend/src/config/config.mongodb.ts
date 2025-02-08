import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường từ .env

const dev = {
  app: {
    port: process.env.DEV_APP_PORT || 3052
  },
  db: {
    host: process.env.DEV_DB_HOST || 'localhost',
    port: process.env.DEV_DB_PORT || 27017,
    name: process.env.DEV_DB_NAME || 'ShopDEV3'
  }
}

export default dev
