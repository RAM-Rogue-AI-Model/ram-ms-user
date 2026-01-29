import { configType } from '../types/config';

const config: configType = {
  PORT: Number(process.env.PORT ?? 3002),
  DATABASE_URL: `mysql://${process.env.DATABASE_USER}:${process.env.DATABASE_PASSWORD}@${process.env.DATABASE_HOST}:${Number(process.env.DATABASE_PORT)}/${process.env.DATABASE_DB_NAME}`,
  DATABASE_HOST: process.env.DATABASE_HOST ?? 'localhost',
  DATABASE_USER: process.env.DATABASE_USER ?? 'user',
  DATABASE_PASSWORD: process.env.DATABASE_PASSWORD ?? '',
  DATABASE_PORT: Number(process.env.DATABASE_PORT ?? 3306),
  DATABASE_DB_NAME: process.env.DATABASE_DB_NAME ?? 'ram-ms-user-db',
};

export { config };
