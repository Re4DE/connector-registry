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

export class TargetNode {
  @ApiProperty({
    example: 'My-Connector',
    description: 'A readable name of the connector',
  })
  public readonly name: string;

  @ApiProperty({
    example: 'did:web:my-con.dataspace.de:myself',
    description:
      'The participant id of the requesting connector, often this is a DIDWeb',
  })
  public readonly id: string;

  @ApiProperty({
    example: 'https://my-con.net/api/v1/dsp',
    description: 'Dataspace protocol endpoint of the connector',
  })
  public readonly url: string;

  @ApiProperty({
    example: 'dataspace-protocol-http',
    description:
      'The used protocol of the connector, currently only dataspace-protocol-http is supported',
  })
  public readonly supportedProtocols: string[];
}
