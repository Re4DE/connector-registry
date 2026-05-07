# Connector Registry

[![license](https://img.shields.io/github/license/eclipse-edc/Connector?style=flat-square&logo=apache)](https://www.apache.org/licenses/LICENSE-2.0)

---

This service provides a Connector Registry for registering connectors in a dataspace.
Through this registration, other Connectors can discover all participants in the dataspace.
The Registry also automatically unregisters all unreachable Connectors after a configurable timeout.

## Versioning

We use semantic versioning and add the Eclipse Dataspace Components (EDC) version as a label to indicate compatibility. 
For example, version `1.0.0-edc0.14.0` means that version `1.0.0` of the connector registry is compatible with all EDCs of version `0.14.0`. 
If possible, we provide backports of fixes that affect older EDC versions as well.
To get the latest build of the connector registry, use the version `SNAPSHOT`.

## Configuration

The service has the following configuration variables, which need to be set in production. For development, default values have already been defined.

| Name                        | Default     | Description                                                                                                  |
|-----------------------------|-------------|--------------------------------------------------------------------------------------------------------------|
| NODE_ENV                    | development | Determine which dependencies will be installed by npm. Options development/production                        |
| PORT                        | 3000        | The port on which this service will listen                                                                   |
| API_PREFIX                  | api         | A prefix that will be added to all endpoints                                                                 |
| API_KEY                     | devpass     | The api key that need to be set to the 'x-api-key' header to access the API                                  |
| MONGO_HOST                  | localhost   | The host name of the `MongoDB` instance                                                                      |
| MONGO_PORT                  | 27017       | The port of the `MongoDB` instance                                                                           |
| MONGO_USER                  | root        | The username of the admin account of the `MongoDB` instance                                                  |
| MONGO_PASS                  | devpass     | The password of the admin account of the `MongoDB` instance                                                  |
| MONGO_DB_NAME               | registry    | The name of the database to save registered connectors                                                       |
| REGISTRY_UNREGISTER_TIMEOUT | 60          | Time to wait until all registered connectors are checked to see whether they are still reachable, in seconds |

If you want to override variables locally, create a `.env` file and define the variables to override there.

```bash
#.env

PORT=3001
API_PREFIX=my-prefix
...
```

## Production Deployment

For a productive deployment, use the provided [Helm Chart](chart/README.md).
The readme also describes all configurable values.
The production deployment assumes that you use a Kubernetes cluster or a comparable system.

### 1. Create a overwrite.yaml

We recommend creating a `overwrite.yaml` file to overwrite the default values from the Helm Chart. 
The deployment of the registry highly depends on your target infrastructure. 
The following example file is an orientation only and needs to be adjusted by you to fit your infrastructure.
See the [Helm Chart](chart/README.md) documentation to see all values that can be configured.

```yaml
# overwrite.yaml

registry:
  ingress:
    host: registry.my-dataspace.de
  auth:
    apiKey: my-secret-pass-123!

```

### 2. Deploy with Helm

```bash
$ helm install connector-registry -f overwrite.yaml oci://ghcr.io/re4de/charts/connector-registry --version 1.0.1 --namespace connector-registry --create-namespace
```

## Local Development

If you have checked this repository freshly, start with `1.`, or jump directly to `3.`

### 1. Start environment from the connector repository

As the Connector Registry cannot be used without a `MongoDB` database, there need to be a running instance of it.
You can use the [local-dev](https://github.com/Re4DE/connector/blob/main/runtimes/local-dev/docker-env/src/main/docker/docker-compose.yaml) runtime from the connector repository for that.

### 2. Project preparations

```bash
$ npm i
```

### 3. Start the service

```bash
$ npm run start:dev
```

`Swagger-API` is available under `http://localhost:3000/api`.

## Known Issues

- Deep DTO verification is not used, as the connectors seems to have encoding issues
