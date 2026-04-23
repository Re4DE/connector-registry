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

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';

import { Model } from 'mongoose';

import { TargetNode } from './dao';
import { RegisterConnectorDto, UpdateConnectorDto } from './dto';

@Injectable()
export class RegistryService {
  constructor(
    @InjectModel(TargetNode.name) private targetNodeModel: Model<TargetNode>,
  ) {}

  public async registerConnector(
    dto: RegisterConnectorDto,
  ): Promise<TargetNode> {
    return new this.targetNodeModel(dto).save();
  }

  public async getConnector(id: string): Promise<TargetNode> {
    return this.targetNodeModel.findOne({ id }).exec();
  }

  public async getAllConnectors(id: string): Promise<TargetNode[]> {
    return this.targetNodeModel.find({ id: { $ne: id } }).exec();
  }

  public async updateConnector(
    id: string,
    dto: UpdateConnectorDto,
  ): Promise<TargetNode> {
    return this.targetNodeModel
      .findOneAndUpdate({ id }, dto, { returnOriginal: false })
      .exec();
  }

  public async unregisterConnector(id: string): Promise<TargetNode> {
    return this.targetNodeModel.findOneAndDelete({ id }).exec();
  }
}
