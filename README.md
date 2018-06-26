# Stronger Things Web Client

## Required Environment variables

Example env variables to run app below. To have these loaded easily into app in development, create an `.env.local` file at root and paste the env vars in there. This file is not tracked by git and will be only local to your environment.

```shell
VUE_APP_PARSE_APP_ID=stronger-things
VUE_APP_PARSE_SERVER_URL=https://stronger-things-dev.herokuapp.com/parse
```

## Development

```shell
npm install
npm start
# App available at localhost:8080
```

## Production Build

```shell
npm run build
# Built assets should be served from dist/ folder
```
