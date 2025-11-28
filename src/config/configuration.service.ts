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
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ConfigurationService {
  constructor(private configService: ConfigService) {}

  get env(): string {
    return this.configService.get('env');
  }

  get port(): number {
    return this.configService.get('port');
  }

  get apiPrefix(): string {
    return this.configService.get('apiPrefix');
  }

  get keycloakServerUrl(): string {
    return this.configService.get('auth.serverUrl');
  }

  get keycloakRealm(): string {
    return this.configService.get('auth.realm');
  }

  get keycloakClientId(): string {
    return this.configService.get('auth.clientId');
  }

  get keycloakClientSecret(): string {
    return this.configService.get('auth.clientSecret');
  }

  get mongoUri(): string {
    const host = this.configService.get('database.host');
    const port = this.configService.get('database.port');
    const username = this.configService.get('database.username');
    const password = this.configService.get('database.password');
    const dbName = this.configService.get('database.dbName');

    return `mongodb://${username}:${password}@${host}:${port}/${dbName}`;
  }

  get unregisterTimeout(): number {
    return this.configService.get('registry.unregisterTimeout');
  }
}
