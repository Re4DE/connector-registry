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

import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { RegistryService } from './registry.service.js';
import { RegistryController } from './registry.controller.js';
import { UnregisterService } from './unregister.service.js';
import { TargetNode } from './dao/target-node.dao.js';
import { TargetNodeSchema } from './schema/target-node.schema.js';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: TargetNode.name, schema: TargetNodeSchema },
    ]),
  ],
  controllers: [RegistryController],
  providers: [RegistryService, UnregisterService],
})
export class RegistryModule {}
