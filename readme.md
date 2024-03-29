# Shortcut Url Shortener

The goal of this project is to create a REST API that shortens URLs. The API should be able to receive a URL and return a shortened version of it. The API should also be able to receive a shortened URL and return the original URL.

## Dependencies
The project uses [NodesJs and NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm). See the link for installation instructions.

You can optionally use [Docker](https://docs.docker.com/get-docker/) to run the project.

The database and authentication services are hosted on [Firebase](https://console.firebase.google.com).

## Getting started
To get started, you will first need access to the firebase project -- create a firebase account and request access. Then you need to download a service account file from the firebase console and place it in the root directory. The file should be named `service_account.json`. **This file contains a private key and should not be shared.**

To run the project locally:
```bash
npm install
npm dev
```
The server runs on port 3001 by default. It is configurable as an environment variable.
The fronted for this project can be found [here](https://github.com/Joshua-Schecker/url-short-frontend)

### Using Docker
To run the project using docker:
```bash
docker build -t shorten-url .
docker run -it -p 3001:3001 shorten-url
```

## Architecture
The project is built using NodeJs and Express. The document store and authentication service is hosted on Firebase. The project uses a REST API to communicate with the frontend. It supports creating and updating shortened URLs, as well as redirecting to the full url when provided with the shortend version.

The service has a single collection called `urls` which contains a full URL and the user ID of the resource creator. The ID or the resource fucntions as it's shortened URL path. The user ID is used to authenticate the user and ensure that only the creator of the URL can update it. The userId is retrieved from the JWT.

The ID of the document is the same as the short url path. This ensures that the short url is unique. I would prefer to use a unique constraint for the `shortUrl` field, but this is not supported by Firestore.

### Reasoning
I chose Firebase because it offered a one-stop shop for both document storage and authentication. It also has a free tier which is suitable for this project, and many other services which would be of use if the project is developed further. 

I chose NodeJs and Express because they are simple and familiar to me. The project is small and does not require a complex framework or a more performant language.

### Things I would do differently
Although the project specified that a UI was not expected, I created a simple one to test the API. I realized a little late that Firebase expects user authentication to occur on the client side, and so I had to create a simple UI to test the API. This wasn't ideal, but it was the simplest way to test the API. Instead I should have chosen a different authentication service or created a simple authentication service on the server side.

### TODOS:
- Add integration tests
- Add tests for update and get endpoints
- Add support for firebase emulators to make local dev easier