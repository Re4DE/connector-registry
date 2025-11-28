# Connector Registry

This service provides a registry where connectors of a data space can be registered.
Through this registration other connectors are able to discover all participants of the data space.
The registry also unregister all connectors automatically if they are not reachable after a timeout.

## Local Development

If you have checked this repository freshly out start with `1.`, or jump 
directly to `4.`.

### 1. Provide a Keycloak instance

The service expects a running instance of keycloak with a pre-configured client 
that uses client+secret for authentication. See [Identity-Chart](https://gitlab.cc-asp.fraunhofer.de/future-energy-lab-testfeld/identity-chart).

### 2. Database preparation

The service expects a running MongoDB instance reachable under 
`http://localhost:27017` with an admin user `root` and the password
`devpass`. 

```bash
$ docker volume create mongo-data
$ docker run -d --name mongo -p 27017:27017 \
    -e MONGO_INITDB_ROOT_USERNAME=root \
    -e MONGO_INITDB_ROOT_PASSWORD=devpass \
    --mount source=mongo-data,target=/data/db
    mongo:7.0.11
```

### 3. Project preparations

```bash
$ npm i
```

### 4. Start the service

```bash
$ npm run start:dev
```

Swagger API is available under `http://localhost:3000/api`.

## Configuration

The service has the following configuration variables, which need to be set 
in production. For development, default values have already been defined.

| Name                        | Default               | Description                                                                                            |
|-----------------------------|-----------------------|--------------------------------------------------------------------------------------------------------|
| NODE_ENV                    | development           | Determine which dependencies will be installed by npm                                                  |
| PORT                        | 3000                  | The port on which this service will listen                                                             |
| API_PREFIX                  | api                   | A prefix that will be added to all endpoints                                                           |
| KEYCLOAK_URL                | http://localhost:8080 | Authentication endpoint of keycloak                                                                    |
| KEYCLOAK_REALM              | ds-test               | The realm of keycloak thats holds the clients                                                          |
| KEYCLOAK_CLIENT_ID          | connector-registry    | The name of the client                                                                                 |
| KEYCLOAK_CLIENT_SECRET      | devpass               | The secret of the client                                                                               |
| MONGO_HOST                  | localhost             | The host name of the MongoDB instance                                                                  |
| MONGO_PORT                  | 27017                 | The port of the MongoDB instance                                                                       |
| MONGO_USER                  | root                  | The username of the admin account of the MongoDB instance                                              |
| MONGO_PASS                  | devpass               | The password of the admin account of the MongoDB instance                                              |
| MONGO_DB_NAME               | registry              | The name of the database to save registered connectors                                                 |
| REGISTRY_UNREGISTER_TIMEOUT | 30                    | Time to wait until all registered connectors will be check whether thy are still reachable, in seconds |

If you want to override variables, you need to create a `.env` file and 
define there the variables to override.

```bash
PORT=3001
API_PREFIX=my-prefix
...
```

## Production Deployment

For a productive deployment, use the [Helm Chart](chart/README.md) provided.
As this service is part of a Data Space, deploying the
[Umbrella-Chart](https://gitlab.cc-asp.fraunhofer.de/future-energy-lab-testfeld/umbrella-chart) is much easier.
If you will not use the Umbrella Chart yourself, you must follow these steps.

### 1. Keycloak

Make sure you have a running and configured instance of `Keycloak`.
The instance should have configured a realm like `my-dataspace` with 
a client `connector-registry`. The client's authentication method should
be `Client Id and Secret`. 

### 2. Namespace

Create a namespace for the registry.

```bash
$ kubectl create namespace connector-registry
```

### 3. Create Gitlab pull secret

To use the `Docker Image` from `GitLab` you have to create a Kubernetes secret
with the Docker Registry credentials.

```bash
$ kubectl create secret docker-registry gitlab \
    --docker-server=https://container-registry.gitlab.cc-asp.fraunhofer.de \
    --docker-username=your-gitlab-token-name \
    --docker-password=your-gitlab-token \
    -n connector-registry
```

### 4. Create Keycloak secret

Create a Kubernetes secret which will hold the `client secret` of the 
`connector-registry` client from `Keycloak`.

```bash
$ kubectl create secret generic registry-secret \
    --from-literal=client-secret=123456!
    -n connector-registry
```

### 5. Deploy with Helm

Deploy the service with Helm. Compare [Helm Chart](chart/README.md).

```bash
$ helm dependency update
$ helm install connector-registry . --namespace connector-registry
```

## Known Issues

- Deep DTO verification is not used, as the connectors seems to have encoding issues
