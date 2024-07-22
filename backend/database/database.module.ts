import { Global, Module } from '@nestjs/common';
import { TypeOrmModule, type TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule, type ConfigType } from '@nestjs/config';

import config from 'src/environments';
@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      load: [config],
    }),
    TypeOrmModule.forRootAsync({
      inject: [config.KEY],
      useFactory: (configService: ConfigType<typeof config>) => {
        return {
          type: configService.database.type,
          host: configService.database.host,
          port: configService.database.port,
          username: configService.database.username,
          password: configService.database.password,
          database: configService.database.database,
          autoLoadEntities: true,
          synchronize: configService.database.synchronize,
          useSanitizeQuery: true,
          timezone: configService.database.timezone,
        } as TypeOrmModuleOptions;
      },
    }),
  ],
  exports: [ConfigModule, TypeOrmModule],
})
export class DatabaseModule {}
