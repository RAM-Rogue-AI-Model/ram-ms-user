import { PrismaMariaDb } from '@prisma/adapter-mariadb';

import { PrismaClient } from '../../generated/prisma/client';
import { config } from './config';

const adapter = new PrismaMariaDb({
  host: config.DATABASE_HOST,
  user: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,
  database: config.DATABASE_DB_NAME,
  port: config.DATABASE_PORT,
  connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

const init = async () => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    // eslint-disable-next-line no-console
    console.log('Connected to MariaDB successfully');
  } catch (error) {
    console.error('Failed to connect to MariaDB on startup: ', error);
  }
};
void init();

export { prisma };
