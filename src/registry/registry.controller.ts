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
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger';

import { AuthenticatedUser } from 'nest-keycloak-connect';

import { TargetNode } from './dao';
import { RegisterConnectorDto, UpdateConnectorDto } from './dto';
import { RegistryService } from './registry.service';

@ApiTags('registry')
@Controller('registry')
export class RegistryController {
  constructor(private readonly registryService: RegistryService) {}

  @ApiBody({
    type: RegisterConnectorDto,
    description: 'Register a new connector to the dataspace',
  })
  @ApiResponse({
    status: 200,
    description: 'The connecter was registered successfully',
    type: TargetNode,
  })
  @ApiResponse({
    status: 400,
    description:
      'Bad request error, dto error or connector is already registered',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
  })
  @Post()
  public async register(
    @AuthenticatedUser() user: any,
    @Body() dto: RegisterConnectorDto,
  ): Promise<TargetNode> {
    const doc = await this.registryService.getConnector(user.azp);
    if (doc) {
      throw new BadRequestException('Connector already registered');
    }

    return this.registryService.registerConnector(user.azp, dto);
  }

  @ApiResponse({
    status: 200,
    type: [TargetNode],
    description:
      'A list with all registered connectors, excluding the connector who requests',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
  })
  @Get()
  public async findAll(@AuthenticatedUser() user: any): Promise<TargetNode[]> {
    return this.registryService.getAllConnectors(user.azp);
  }

  @ApiBody({
    type: UpdateConnectorDto,
    description: 'The values that should be updated',
  })
  @ApiResponse({
    status: 200,
    type: TargetNode,
    description:
      'Updates the data of a connector and returns the updated values',
  })
  @ApiResponse({
    status: 403,
    description: 'Unauthorized',
  })
  @ApiResponse({
    status: 404,
    description: 'Connector not found or not registered',
  })
  @Patch(':id')
  public async updateOne(
    @Param('id') id: string,
    @Body() dto: UpdateConnectorDto,
  ): Promise<TargetNode> {
    const doc = await this.registryService.getConnector(id);
    if (!doc) {
      throw new NotFoundException('Connector is not registered');
    }

    return this.registryService.updateConnector(id, dto);
  }
}
