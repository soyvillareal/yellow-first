import { ConfigModule } from '@nestjs/config/dist/config.module';
import { DataSource } from 'typeorm';
import { SeederOptions } from 'typeorm-extension';
import { DataSourceOptions } from 'typeorm/data-source';

import { config, database } from 'src/environments';

ConfigModule.forRoot({
  envFilePath: `.env.${config.node_env}`,
});
const IS_LOCAL = config.node_env === 'local';

export const optionsDatabase = {
  type: database.type as 'postgres',
  host: database.host,
  port: +database.port,
  database: database.database,
  username: database.username,
  password: database.password,
  entities: database.entities,
  migrationsTableName: database.migrationsTableName,
  migrations: database.migrations,
  seeds: database.seeds,
  synchronize: IS_LOCAL, // never use TRUE in production!
  timezone: database.timezone,
};

export const dataSource = new DataSource(optionsDatabase as DataSourceOptions & SeederOptions);
