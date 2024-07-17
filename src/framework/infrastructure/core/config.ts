import { ConfigService, registerAs } from '@nestjs/config';
// eslint-disable-next-line import/no-extraneous-dependencies
import { config as dotenvConfig } from 'dotenv';

const env = dotenvConfig({ path: `.env.${process.env.NODE_ENV}` });
const configService = new ConfigService({ load: [() => env] });

const IS_LOCAL = configService.get<string>('NODE_ENV') === 'local';

export const database = {
  type: configService.get<string>('DB_TYPE'),
  host: configService.get<string>('DB_HOST'),
  port: configService.get<string>('DB_PORT'),
  database: configService.get<string>('DB_NAME'),
  username: configService.get<string>('DB_USER'),
  password: configService.get<string>('DB_PASSWORD'),
  entities: ['src/**/*.{model,modelo}{.ts,.js}', '!src/migrate-data/**/*.model{.ts,.js}'],
  migrationsTableName: 'migrations_th',
  migrations: [`src/database/migrations/${configService.get<string>('NODE_ENV')}/*{.ts,.js}`],
  seeds: ['src/**/*.seed.service{.ts,.js}'],
  synchronize: IS_LOCAL, // never use TRUE in production!
  timezone: configService.get<string>('TZ'),
};

export const config = {
  database: database,
  node_env: configService.get<string>('NODE_ENV'),
  secret_key: configService.get<string>('JWT_SECRET_KEY'),
  jwt_expires_in: configService.get<string>('JWT_EXPIRES_IN'),
  api_gateway: configService.get<string>('API_GATEWAY'),
  public_key: configService.get<string>('PUBLIC_KEY'),
  private_key: configService.get<string>('PRIVATE_KEY'),
};

export default registerAs('config', () => config);
