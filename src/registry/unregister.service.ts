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

import { HttpService } from '@nestjs/axios';
import {
  Injectable,
  Logger,
  OnApplicationBootstrap,
  OnApplicationShutdown,
} from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';

import axios from 'axios';
import { firstValueFrom } from 'rxjs';

import { ConfigurationService } from '../config';
import { RegistryService } from './registry.service';

@Injectable()
export class UnregisterService
  implements OnApplicationBootstrap, OnApplicationShutdown
{
  private readonly logger = new Logger(UnregisterService.name);

  private intervalName: string = 'unregister';

  constructor(
    private readonly conf: ConfigurationService,
    private readonly http: HttpService,
    private readonly registryService: RegistryService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  public onApplicationBootstrap(): void {
    const millis = this.conf.unregisterTimeout * 1000;
    const interval = setInterval(
      () => this.unregisterInactiveConnectors(),
      millis,
    );
    this.schedulerRegistry.addInterval(this.intervalName, interval);
    this.logger.log('Start connector watchdog');
  }

  private async unregisterInactiveConnectors() {
    this.logger.log('Start unregister check for connectors');
    const cons = await this.registryService.getAllConnectors('');
    this.logger.log('Found ' + cons.length + ' connectors');
    for (const con of cons) {
      try {
        this.logger.log(`Check connector ${con.name} at ${con.url}`);
        const res = await firstValueFrom(
          this.http.get(`${con.url}/2025-1/catalog/request`),
        );
        this.logger.log(
          `Connector ${con.name} reachable, response status: ` + res.status,
          res.data,
        );
      } catch (err) {
        if (axios.isAxiosError(err)) {
          const status = err.response?.status;
          // Errors like dns failure, timeout, network unreachable etc.
          const isNotReachable = !err.response;
          // All status codes except 405
          const isUnexpectedStatus = status && status !== 405;

          if (isNotReachable || isUnexpectedStatus) {
            this.logger.warn(
              `Remove connector ${con.name} because it was not reachable`,
            );
            await this.registryService.unregisterConnector(con.id);
          } else {
            // Expected statuscode 405
            this.logger.log(`Connector ${con.name} is reachable`, err);
          }
        } else {
          // Maybe unregister here as well
          this.logger.warn('Unknown error when contacting connector', err);
        }
      }
    }
  }

  public onApplicationShutdown(signal?: string): void {
    if (this.schedulerRegistry.getIntervals().length > 0) {
      this.schedulerRegistry.deleteInterval(this.intervalName);
      this.logger.log(`Stop connector watchdog after ${signal}`);
    }
  }
}
