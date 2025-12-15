# Connector Registry Helm Chart

A Helm chart for the connector registry. The registry deployment consists of the service itself and a MongoDB. The MongoDB deployment can be deactivated if a running instance is already available.

It will be deployed:
- Connector Registry
- MongoDB (optional)

## Configuration

The documentation of the `mongodb` specific fields can be found in the Bitnami Helm Chart [Documentation](https://github.com/bitnami/charts/blob/mongodb/15.6.26/bitnami/mongodb/README.md).
Fields marked in the `Override` column must be set for production deployment.

| Key                              | Default                                      | Description                                                                                                | Override |
|----------------------------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------|----------|
| install.mongodb                  | true                                         | Toggle the deployment of a `MongoDB`                                                                       |          |
|                                  |                                              |                                                                                                            |          |
| global.defaultStorageClass       | default                                      | Used storage class to create PVCs                                                                          |          |
| global.secrets.mongo.secretName  | mongodb-secret                               | Name of the `MongoDB` secret to hold passwords                                                             |          |
| global.secrets.mongo.keys        | [mongodb-root-password, mongodb-passwords]   | Keys for that will generate a random password in the `MongoDB` secret                                      |          |
|                                  |                                              |                                                                                                            |          |
| namespaceOverride                | ""                                           | Override the namespace                                                                                     |          |
|                                  |                                              |                                                                                                            |          |
| registry.unregisterTimeout       | 60                                           | Time to wait until all registered connectors will be check whether thy are still reachable, in seconds     |          |
| registry.image.repository        | ghcr.io/re4de/connector-registry             | Repository URL of the Docker Image                                                                         |          |
| registry.image.tag               | 1.0.0-edc0.14.0                              | Tag of the Docker Image, use SNAPSHOT for latest version                                                   |          |
| registry.service.port            | 3000                                         | Port of the registry API                                                                                   |          |
| registry.ingress.enabled         | true                                         | Toggle the ingress rules                                                                                   |          |
| registry.ingress.host            | changeme                                     | DNS for the registry                                                                                       | X        |
| registry.ingress.path            | /api                                         | API prefix path                                                                                            |          |
| registry.auth.authKey            | changeme                                     | Keycloak client                                                                                            | X        |
| registry.database.host           | null                                         | Set the hostname of the `MongoDB`, only needed if `install.mongodb` is `false`                             |          |
| registry.database.port           | 27017                                        | Set the port of the mongodb                                                                                |          |
| registry.database.username       | connector-registry                           | Set the username of the `MongoDB` user to authenticate on the database                                     |          |
| registry.database.dbName         | registry                                     | Set name of the database to save data                                                                      |          |
| registry.database.existingSecret | mongodb                                      | The name of the secret that holds the mongodb user password                                                |          |
