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

After that, other devs may have to recreate the containers, because only when the images are created, the packages are installed.

> Check the `dev-clean` target in the `Makefile`

### Modifying DB Schema (e.g. Creating New Tables)
Since we have a volume for the database container, in order to make modifications to the schema, we have to get rid of the existing volume. Otherwise, when the `postgres` container is starting, it will detect an existing DB in the volume, and won't recreate the new schema.

> We're mounting the schema file as a volume in `/docker-entrypoint-initdb.d/schema.sql`. By default, the `postgres` container will execute any script under `/docker-entrypoint-initdb.d/` only if it doesn't find an existing database.

So in order to list the volumes:
```
docker volumes ls
```

Once you find the one you want to delete, you can do so with:
```
docker volume rm hyper-express_pg-express-data
```

Now, when you restart the `postgres` container, it won't find the database, and it'll run the aforementioned script, in order to recreate the schema.