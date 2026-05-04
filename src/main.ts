/*
 *  Copyright (c) 2025 Fraunhofer Institute for Energy Economics and Energy System Technology (IEE)
 *
 *  This program and the accompanying materials are made available under the
 *  terms of the Apache License, Version 2.0 which is available at
 *  https://www.apache.org/licenses/LICENSE-2.0
 *
 *  SPDX-License-Identifier: Apache-2.0
 *
 *  Contributors:
 *       Fraunhofer IEE - initial API and implementation
 *
 */

import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from './app.module';
import { ConfigurationService } from './config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn', 'fatal', 'log'],
  });

  const conf = app.get(ConfigurationService);

  app.enableShutdownHooks();
  app.setGlobalPrefix(conf.apiPrefix);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  // Swagger
  const swagger = new DocumentBuilder()
    .setTitle('Connector Registry Service')
    .setDescription(
      'Endpoints to register a new Connector in a data space, or to change the URL of a existing one.',
    )
    .setVersion('1.0.1-edc0.14.0')
    .addApiKey({ type: 'apiKey', name: 'x-api-key', in: 'header' }, 'api-key')
    .build();
  const swaggerDoc = SwaggerModule.createDocument(app, swagger);
  SwaggerModule.setup(conf.apiPrefix, app, swaggerDoc);

  await app.listen(conf.port);
}
bootstrap();
