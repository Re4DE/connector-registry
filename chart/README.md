# Connector Registry Helm Chart

A Helm chart for the connector registry. The registry deployment consists of the service itself and a MongoDB. The MongoDB deployment can be deactivated if a running instance is already available. The registry expects a running and configured instance of an identity provider like Keycloak.

It will be deployed:
- Connector Registry
- MongoDB (optional)

## Configuration

If a local deployment is needed, create a `overwrite.yaml` file and overwrite the needed keys. The documentation of the `mongodb` specific fields can be found in the bitnami Helm Chart [Documentation](https://github.com/bitnami/charts/blob/mongodb/15.6.26/bitnami/mongodb/README.md).

| Key                              | Default                                      | Description                                                                                                |
|----------------------------------|----------------------------------------------|------------------------------------------------------------------------------------------------------------|
| install.mongodb                  | true                                         | Toggle the deployment of a MongoDB                                                                         |
|                                  |                                              |                                                                                                            |
| global.defaultStorageClass       | harvester                                    | Used storage class to create PVCs                                                                          |
| global.secrets.mongo.secretName  | mongodb                                      | Name of the mongodb secret to hold passwords                                                               |
| global.secrets.mongo.keys        | [mongodb-root-password, mongodb-password]    | Keys that will generate a random password in the mongodb secret                                            |
|                                  |                                              |                                                                                                            |
| namespaceOverride                | ""                                           | Override the namespace                                                                                     |
|                                  |                                              |                                                                                                            |
| registry.unregisterTimeout       | 30                                           | Time to wait until all registered connectors will be check whether thy are still reachable, in seconds     |
| registry.image.repository        | .../.../connector-registry                   | Repository URL of the Docker Image                                                                         |
| registry.image.tag               | 0.2.2                                        | Tag of the Docker Image                                                                                    |
| registry.image.pullSecret        | gitlab                                       | Name of the Docker Registry credential secret                                                              |
| registry.service.port            | 3000                                         | Port of the registry API                                                                                   |
| registry.ingress.enabled         | true                                         | Toggle the ingress rules                                                                                   |
| registry.ingress.host            | registry-dena.services.iee.fraunhofer.de     | DNS for the registry                                                                                       |
| registry.ingress.path            | /api                                         | API prefix path                                                                                            |
| registry.auth.url                | https://auth-dena.services.iee.fraunhofer.de | Keycloak Server URL                                                                                        |
| registry.auth.realm              | dena                                         | Keycloak realm name                                                                                        |
| registry.auth.clientId           | connector-registry                           | Keycloak client                                                                                            |
| registry.auth.existingSecret     | registry-secret                              | Name of the secret that holds the Keycloak Client Secret                                                   |
| registry.database.external       | false                                        | Toggle the usage of separate mongodb deployment, set only to `true` if `install.mongodb` is set to `false` |
| registry.database.host           | my.host                                      | Set the hostname of the mongodb, only needed if `registry.database.external` is true                       |
| registry.database.port           | 27017                                        | Set the port of the mongodb                                                                                |
| registry.database.username       | connector-registry                           | Set the username of the mongodb user to authenticate on the database                                       |
| registry.database.dbName         | registry                                     | Set name of the database to save data                                                                      |
| registry.database.existingSecret | mongodb                                      | The name of the secret that holds the mongodb user password                                                |
