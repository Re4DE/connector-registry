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

import { HttpStatus, INestApplication } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { Test } from '@nestjs/testing';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { MongoMemoryServer } from 'mongodb-memory-server';

import * as request from 'supertest';

import { ConfigurationModule } from '../src/config';
import { RegistryModule } from '../src/registry';

const testCon = {
  name: 'Test Connector',
  url: 'http://localhost:8080/api/v1/dsp',
  supportedProtocols: ['dataspace-protocol-http'],
};

const updateCon = {
  name: 'Test Connector 2',
  url: 'http://mydomain.net/api/v1/dsp',
};

describe('Registry', () => {
  let app: INestApplication;
  let mongod: MongoMemoryServer;
  let server: any;

  beforeAll(async () => {
    mongod = await MongoMemoryServer.create();

    const module = await Test.createTestingModule({
      imports: [
        ConfigurationModule,
        MongooseModule.forRoot(mongod.getUri()),
        RegistryModule,
        ScheduleModule.forRoot(),
        ThrottlerModule.forRoot([
          {
            ttl: 60 * 1000,
            limit: 20,
          },
        ]),
      ],
      providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
    }).compile();

    app = module.createNestApplication();

    // Add a authenticated user mock
    app.use([
      (req, res, next) => {
        req.user = {
          azp: 'test-connector',
        };
        next();
      },
    ]);

    await app.init();

    server = app.getHttpServer();
  }, 60 * 1000);

  afterAll(async () => {
    await app.close();
    await mongod.stop();
  }, 60 * 1000);

  it(
    'R.1 should register a new connector to the data space',
    async () => {
      const res = await request(server)
        .post('/registry')
        .send(testCon)
        .expect(HttpStatus.CREATED);
      const data = res.body;

      expect(data.id).toBe('test-connector');
    },
    60 * 1000,
  );

  it(
    'R.2 should not be possible to register the same connector a second time',
    () => {
      return request(server)
        .post('/registry')
        .send(testCon)
        .expect(HttpStatus.BAD_REQUEST);
    },
    60 * 1000,
  );

  it(
    'R.3 should be possible to retrieve all registered connectors resulting with an empty list',
    async () => {
      const res = await request(server).get('/registry').expect(HttpStatus.OK);
      const data = res.body;

      expect(data.length).toBe(0);
    },
    60 * 1000,
  );

  it(
    'R.4 should be possible to update the data of a registered connector',
    async () => {
      const res = await request(server)
        .patch('/registry/test-connector')
        .send(updateCon)
        .expect(HttpStatus.OK);
      const data = res.body;

      expect(data.name).toBe(updateCon.name);
      expect(data.url).toBe(updateCon.url);
    },
    60 * 1000,
  );

  it(
    'R.5 should not be possible to update an non registered connector',
    () => {
      return request(server)
        .patch('/registry/test-connector-not-exist')
        .send(updateCon)
        .expect(HttpStatus.NOT_FOUND);
    },
    60 * 1000,
  );

  it(
    'R.8 should bring an empty list after unregister of all connectors',
    async () => {
      const res = await request(server).get('/registry').expect(HttpStatus.OK);
      const data = res.body;

      expect(data.length).toBe(0);
    },
    60 * 1000,
  );
});
