interface configType {
  PORT: number;
  API_GATEWAY_URL: string;
  DATABASE_URL: string;
  DATABASE_PORT: number;
  DATABASE_HOST: string;
  DATABASE_USER: string;
  DATABASE_PASSWORD: string;
  DATABASE_DB_NAME: string;

  SALT_ROUNDS: number;
  JWT_SECRET: string;
}

export { configType };
