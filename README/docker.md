# Docker Setup
The Docker makes use of several [Docker compose files](https://docs.docker.com/compose/compose-file/):

* `compose.yml` contains the database service (and pgAdmin), which we use both in development and production.
* `compose-dev.yml` contains the `hypertube-express` service, which is a Node.js container running our Express.js app.

## During Development
To start the services we need during development we run:
```
docker compose -f compose.yml -f compose-dev.yml up
```

> I guess the order is important, since the services in the second file depend on services on the first file.

Note that we've mounted a [volume](https://docs.docker.com/storage/volumes/) in our host (instead of a [bind mount](https://docs.docker.com/storage/bind-mounts/)), so that the `node_packages` folder is not overwritten when we mount the whole `server` folder into our container (we need to do that because we have to edit the source code).

> If you check the `Dockerfile.dev` file, you'll see that we run `npm install` to get our dependencies installed inside the container. Then, when we mount the `server` folder (from our host) onto the `/app` folder (inside the container), the `node_modules` folder would be overwritten (since it doesn't exist on the host!).

### Installing new packages
With the conditions described above, if we need to install some package, we'll have to do it in the **container** itself (not in the **host**). You can run ``docker ps`` to get the ID of the container where you want to install the packages, and then run:
```
docker exec -it 59b9ef0e502a npm uninstall dotenv
```