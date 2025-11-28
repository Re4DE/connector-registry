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

import { ApiProperty } from '@nestjs/swagger';

import { IsNotEmpty, IsString } from 'class-validator';

export class RegisterConnectorDto {
  @ApiProperty({
    example: 'My-Connector',
    required: true,
    description: 'A readable name of the connector',
  })
  @IsNotEmpty()
  @IsString()
  public readonly name: string;

  @ApiProperty({
    example: 'https://my-con.net/api/v1/dsp',
    required: true,
    description: 'Dataspace protocol endpoint of the connector',
  })
  @IsNotEmpty()
  public readonly url: string;

  @ApiProperty({
    example: 'dataspace-protocol-http',
    required: true,
    description:
      'The used protocol of the connector, currently only dataspace-protocol-http is supported',
  })
  @IsNotEmpty()
  @IsString({ each: true })
  public readonly supportedProtocols: string[];
}
