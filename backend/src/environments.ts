import { ConfigService, registerAs } from '@nestjs/config';
import { config as dotenvConfig } from 'dotenv';

const env = dotenvConfig({ path: `.env.${process.env.NODE_ENV}` });
const configService = new ConfigService({ load: [() => env] });

const IS_LOCAL =
  configService.get<string>('NODE_ENV', {
    infer: true,
  }) === 'local';

export const database = {
  type: configService.get<string>('DB_TYPE', {
    infer: true,
  }),
  host: configService.get<string>('DB_HOST', {
    infer: true,
  }),
  port: configService.get<string>('DB_PORT', {
    infer: true,
  }),
  database: configService.get<string>('DB_NAME', {
    infer: true,
  }),
  username: configService.get<string>('DB_USER', {
    infer: true,
  }),
  password: configService.get<string>('DB_PASSWORD', {
    infer: true,
  }),
  entities: ['src/**/*.{model,modelo}{.ts,.js}', '!src/migrate-data/**/*.model{.ts,.js}'],
  migrationsTableName: 'migrations_th',
  migrations: [
    `src/database/migrations/${configService.get<string>('NODE_ENV', {
      infer: true,
    })}/*{.ts,.js}`,
  ],
  seeds: ['src/**/*.seed.service{.ts,.js}'],
  synchronize: IS_LOCAL, // never use TRUE in production!
  timezone: configService.get<string>('TZ', {
    infer: true,
  }),
};

export const config = {
  database: database,
  node_env: configService.get<string>('NODE_ENV', {
    infer: true,
  }),
  secret_key: configService.get<string>('JWT_SECRET_KEY', {
    infer: true,
  }),
  jwt_expires_in: configService.get<string>('JWT_EXPIRES_IN', {
    infer: true,
  }),
  api_gateway: configService.get<string>('API_GATEWAY', {
    infer: true,
  }),
  public_key: configService.get<string>('PUBLIC_KEY', {
    infer: true,
  }),
  private_key: configService.get<string>('PRIVATE_KEY', {
    infer: true,
  }),
  integrity_key: configService.get<string>('INTEGRITY_KEY', {
    infer: true,
  }),
  events_key: configService.get<string>('EVENTS_KEY', {
    infer: true,
  }),
};

export default registerAs('config', () => config);
