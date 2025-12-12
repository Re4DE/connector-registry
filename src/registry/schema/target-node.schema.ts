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

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class TargetNode {
  @Prop({ required: true, unique: true })
  public readonly participantId: string;

  @Prop({ required: true })
  public readonly name: string;

  @Prop({ required: true })
  public readonly url: string;

  @Prop({ required: true, type: [String] })
  public readonly supportedProtocols: string[];
}

export const TargetNodeSchema = SchemaFactory.createForClass(TargetNode);
