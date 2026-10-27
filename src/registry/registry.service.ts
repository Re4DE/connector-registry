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

import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { TargetNode } from './dao/target-node.dao.js';
import { RegisterConnectorDto } from './dto/register-connector.dto.js';
import { UpdateConnectorDto } from './dto/update-connector.dto.js';

@Injectable()
export class RegistryService {
  constructor(
    @InjectModel(TargetNode.name) private targetNodeModel: Model<TargetNode>,
  ) {}

  public async registerConnector(
    dto: RegisterConnectorDto,
  ): Promise<TargetNode> {
    const doc = await this.targetNodeModel.findOne({ id: dto.id }).exec();
    if (doc) {
      throw new BadRequestException('Connector already registered');
    }

    return new this.targetNodeModel(dto).save();
  }

  public async getAllConnectors(id: string): Promise<TargetNode[]> {
    return this.targetNodeModel.find({ id: { $ne: id } }).exec();
  }

  public async updateConnector(
    id: string,
    dto: UpdateConnectorDto,
  ): Promise<TargetNode> {
    const doc = await this.targetNodeModel
      .findOneAndUpdate({ id }, dto, { returnDocument: 'after' })
      .exec();
    if (!doc) {
      throw new NotFoundException('Connector is not registered');
    }

    return doc;
  }

  public async unregisterConnector(id: string): Promise<TargetNode> {
    const doc = await this.targetNodeModel.findOneAndDelete({ id }).exec();
    if (!doc) {
      throw new NotFoundException('Connector is not registered');
    }

    return doc;
  }
}
