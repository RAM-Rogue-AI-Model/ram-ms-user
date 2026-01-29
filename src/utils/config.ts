import { configType } from '../types/config';
import dotenv from "dotenv"

dotenv.config()

const config: configType = {
  PORT: Number(process.env.PORT ?? 3002),
  API_GATEWAY_URL: process.env.API_GATEWAY_URL ?? "http://localhost:3001",
  DATABASE_URL: `mysql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${Number(process.env.DATABASE_PORT)}/${process.env.DATABASE_DB_NAME}`,
  DATABASE_HOST: process.env.DATABASE_HOST ?? 'localhost',
  DATABASE_USER: process.env.DATABASE_USER ?? 'user',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? '',
  DATABASE_PORT: Number(process.env.DATABASE_PORT ?? 3306),
  DATABASE_DB_NAME: process.env.DATABASE_DB_NAME ?? 'ram-ms-user-db',

  SALT_ROUNDS: Number(process.env.SALT_ROUNDS) ?? 100,
  JWT_SECRET: process.env.JWT_SECRET ?? "ram-user-secret-jwt-token"
};

export { config };
