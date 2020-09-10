# Dev.to Historical Stats

A Node.js + Vue.js app using RethinkDB in the backend and Chart.js in the frontend to
collect and display historical stats for your Dev.to articles.

Find it running at https://devto-stats.herokuapp.com/.

## Deploy to Heroku

Before deploying to Heroku you need to do the following:

- Go to [RethinkDB Cloud](https://www.rethinkdb.cloud/) and request free alpha access to the RethinkDB Cloud add-on.
- Get an API key from Dev.to (Settings -> Account -> DEV API Keys)

```bash
git clone git@github.com:mostlytyped/dev.to-stats.git
cd dev.to-stats/
heroku create
heroku addons:add rethinkdb
heroku config:set API_KEY=<YOUR_DEV_TO_API_KEY>
git push heroku master
```

_Note: the collection worker needs to be enabled manually on the apps resources dashboard_

## Run locally

To run it locally you need [RethinkDB](https://rethinkdb.com/) installed and running. As for
deploying it to Heroku you also need a Dev.to API key and add it as the `API_KEY` environment
variable.

### Run migrations

```bash
node migrate.js
```

### Run stats collection

```bash
node collect.js
```

## Run app

```bash
node index.js
```
