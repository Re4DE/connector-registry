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

import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { RegistryModule } from './registry/registry.module.js';
import { ConfigurationModule } from './config/configuration.module.js';
import { ConfigurationService } from './config/configuration.service.js';
import { ApiKeyAuthGuard } from './auth/api-key.guard.js';

@Module({
  imports: [
    ConfigurationModule,
    MongooseModule.forRootAsync({
      imports: [],
      useFactory: async (conf: ConfigurationService) => ({
        uri: conf.mongoUri,
      }),
      inject: [ConfigurationService],
    }),
    RegistryModule,
    ScheduleModule.forRoot(),
    ThrottlerModule.forRootAsync({
      useFactory: async (conf: ConfigurationService) => [
        {
          ttl: conf.throttleTTL,
          limit: conf.throttleLimit,
        },
      ],
      inject: [ConfigurationService],
    }),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: ApiKeyAuthGuard },
  ],
})
export class AppModule {}
