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

export default () => ({
  env: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT) || 3000,
  apiPrefix: process.env.API_PREFIX || 'api',
  auth: {
    apiKey: process.env.API_KEY || 'devpass',
  },
  database: {
    host: process.env.MONGO_HOST || 'localhost',
    port: process.env.MONGO_PORT || '27017',
    username: process.env.MONGO_USER || 'root',
    password: process.env.MONGO_PASS || 'devpass',
    dbName: process.env.MONGO_DB_NAME || 'registry',
  },
  registry: {
    unregisterTimeout: process.env.REGISTRY_UNREGISTER_TIMEOUT || 60,
  },
});
