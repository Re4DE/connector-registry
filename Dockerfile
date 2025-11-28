#
#  Copyright (c) 2025 Fraunhofer Institute for Energy Economics and Energy System Technology (IEE)
#
#  This program and the accompanying materials are made available under the
#  terms of the Apache License, Version 2.0 which is available at
#  https://www.apache.org/licenses/LICENSE-2.0
#
#  SPDX-License-Identifier: Apache-2.0
#
#  Contributors:
#       Fraunhofer IEE - initial API and implementation
#
#

FROM node:24.11.1-alpine AS builder

WORKDIR /usr/src/app

COPY --chown=node:node . .

RUN npm ci
RUN npm run build
USER node

FROM node:24.11.1-alpine

WORKDIR /usr/src/app
ENV NODE_ENV=production

COPY --chown=node:node --from=builder /usr/src/app/dist ./dist
COPY --chown=node:node package.json package-lock.json ./

RUN npm ci
EXPOSE 3000
USER node
CMD ["npm", "run", "start:prod"]