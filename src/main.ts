import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as morgan from 'morgan';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// eslint-disable-next-line import/no-extraneous-dependencies
// import { NestExpressApplication } from '@nestjs/platform-express';
import * as basicAuth from 'express-basic-auth';
import moment from 'moment-timezone';

import { AppModule } from './framework/infrastructure/core/app.module';

async function bootstrap() {
  const customFormat = ':method :url';
  const app = await NestFactory.create<any>(AppModule, {
    rawBody: true,
  });

  moment.tz.setDefault(process.env.TZ);

  app.enableCors({
    origin: process.env.CORS_ORIGIN,
    methods: ['GET', 'POST'],
  });
  app.useBodyParser('json', { limit: process.env.BODY_LIMIT });

  app.use(
    [process.env.SWAGGER_SUFFIX],
    basicAuth.default({
      challenge: true,
      users: {
        [process.env.SWAGGER_USERNAME]: process.env.SWAGGER_PASSWORD,
      },
    }),
  );

  const swaggerOptions = new DocumentBuilder()
    .setTitle('API')
    .setDescription(
      'Estos son los limites de la API a tener en cuenta para el consumo de los servicios. <br /> <br /> <b>Limites:</b> <br /> <ul> <li><b>Corto:</b> Se permite un máximo de 3 solicitudes por IP cada segundo. Si se excede este límite, las solicitudes adicionales serán rechazadas hasta que pase 1 segundo desde la primera solicitud.</li> <li><b>Medio:</b> Se permite un máximo de 20 solicitudes por IP cada 10 segundos. Si se excede este límite, las solicitudes adicionales serán rechazadas hasta que pasen 10 segundos desde la primera solicitud.</li> <li><b>Largo:</b> Se permite un máximo de 100 solicitudes por IP cada minuto. Si se excede este límite, las solicitudes adicionales serán rechazadas hasta que pase 1 minuto desde la primera solicitud.</li> </ul> <br /> <strong>Nota:</strong> Estos límites están diseñados para prevenir el abuso de la API y garantizar un servicio justo y equitativo para todos los usuarios. Por favor, asegúrate de diseñar tus solicitudes a la API teniendo en cuenta estos límites.',
    )
    .setContact('Oscar Garcés', 'https://www.soyvillareal.com/', '')
    .setVersion('0.1.0')
    .addBearerAuth()
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerOptions);
  SwaggerModule.setup(process.env.SWAGGER_SUFFIX, app, swaggerDocument);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );
  app.use(morgan.default(customFormat));
  await app.listen(process.env.PORT_APP);
}
bootstrap();
