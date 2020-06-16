# Clean Express Node TypeScript Server

## Table of Contents

1. [Getting Started](#getting-started)
   - [NPM Scripts](#npm-scripts)
   - [Linting](#linting)
2. [Architecture](#architecture)
   - [Core](#core)
   - [Controllers and Models](#controllers-and-models)
3. [Progress](#progress)
   - [Todos](#todos)

## Getting Started

To start a repo from this template, press the `Use this template` button at the top of the page. After cloning the repo started from this template, create a `.env` file matching the shape of `.env.example`. Any additions to your `.env` should be added to [`src/config/index.ts`](https://github.com/smashingboxes/cents/blob/master/src/config/index.ts) as methods on the `env` object so that they produce meaningful errors if future collaborators haven't configured their environment properly. Either rename or delete this `README.md` and rename [`APP_README.md`](https://github.com/smashingboxes/cents/blob/master/APP_README.md) to `README.md`.

### NPM Scripts

```sh
# Run app in development
npm run dev

# Build `.js` files
npm run build

# Run app off of build
npm start
```

### Linting

The `CENTS` template uses [`eslint`](https://eslint.org/) for linting. The `eslint` extension in VS Code should give you syntax highligthing for errors and warnings. If you use a different IDE or editor you can run `./node_modules/.bin/eslint` in the terminal at the working directory of the server app. The configuration extends Airbnb's style guide with certain rules disabled. Linting is meant to maintain consistent code style across collaboration, and reduce focus on granular syntax in code review. The `eslintrc.json` is a work in progress, if there are additional rules you think it needs please create a GitHub issue or submit a pull request.

## Architecture

The CENTS template follows Robert Martin's diagram of [clean architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html). A diagram of `CENTS`' implemenation of this architecture lives in this repo [wiki](https://github.com/smashingboxes/cents/wiki).

### Core

The main patterns used from clean architecture is inversion of dependency and dependency injection. The business logic of the application is isolated from the application's dependencies, and lives inside of the [`/core`](https://github.com/smashingboxes/cents/tree/master/src/core) directory. Data types of our "business objects" are defined in the [`/core/Entities`](https://github.com/smashingboxes/cents/tree/master/src/core/Entities) directory. The flow of data is defined in the [`/core/UseCases`](https://github.com/smashingboxes/cents/tree/master/src/core/UseCases) directory. The interfaces and implementations of our persistence strategy and its dependency injection is defined in [`/core/Adapters`](https://github.com/smashingboxes/cents/tree/master/src/core/Adapters). The [`FsAdapter.ts`](https://github.com/smashingboxes/cents/blob/master/src/core/Adapters/FsAdapter.ts) module is an example implementation simply using Node's file system module to read and write from a `.txt` file to persist our data in [`/db/db.txt`](https://github.com/smashingboxes/cents/tree/master/src/db). Further details are provided in in-line code documentation.

### Controllers and Models

Our models are implementations of our [`PersistenceAdapter`](https://github.com/smashingboxes/cents/blob/master/src/core/Adapters/Persistence.ts) interface that are instantiated with its dependencies. In the case of [`FsAdapter`](https://github.com/smashingboxes/cents/blob/master/src/core/Adapters/FsAdapter.ts), it is instantiated with the [`fs`](https://nodejs.org/api/fs.html) library and the path to the `db.txt` file.

Our controllers are implementations of our `UseCases` instantiated with our model, and any other dependencies. For example [`/controllers/usersControllers.ts`](https://github.com/smashingboxes/cents/blob/master/src/controllers/usersController.ts) takes a model and a [`uuid`](https://www.npmjs.com/package/uuid) module to create an `id` for [`Entity`](https://github.com/smashingboxes/cents/blob/master/src/core/Entities/index.ts) object in our collection.

### HTTP Dependencies

`Core` contains the business rules. In order to apply them to an HTTP server we're using `Express` as our routing and middleware framework. `Core` doesn't have knowledge of `Express`, so in order to use our controller in our `Express` [routes](https://github.com/smashingboxes/cents/blob/master/src/routes/users.ts), we wrap the controller in a [`RequestAdapter`](https://github.com/smashingboxes/cents/blob/master/src/core/Adapters/RequestAdapter.ts) that fits the shape of the callback expected by `Express` and passes the correct arguments to our controller.

## Progress

This repo is a work in progress. Feel free to submit issues and pull requests. The efficacy of the template will improve with usage and hitting edge cases.

### Todos

These todos encapsulate next actions for this template. They will capture in this repo's [issues](https://github.com/smashingboxes/cents/issues).

- [ ] Add testing
- [ ] Incorporate Auth0
- [ ] Implement Postgres adapter
- [ ] Implement Mongoose adapter
- [ ] Include CI/CD boilerplate
