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
import { AuthGuard } from '@nestjs/passport';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { ConfigurationModule, ConfigurationService } from './config';
import { RegistryModule } from './registry';
import { AuthModule } from './auth';

@Module({
  imports: [
    AuthModule,
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
    ThrottlerModule.forRoot([
      {
        ttl: 60 * 1000, // Every 60 seconds
        limit: 20, // Allow 20 requests
      },
    ]),
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useClass: AuthGuard('api-key') },
  ],
})
export class AppModule {}
