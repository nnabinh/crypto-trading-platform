## ℹ️ Crypto trading platform

A simple crypto trading platform

- Node v20 is required
- Eslint/Prettier/Typescript configured
- Expo Router integrated for a simpler navigation system
- Added FlashList for a smoother scrolling experience
- Added Reactotron config/commands for a lightway debugging experience
- RTK for a better redux state management
- RTK queries together with redux-persist for offline-support (You can test it by turning off network connection. Searching and browsing are still working fine without network. Note: If you pull-to-refresh, cached data would be cleared up.)
- As soon as you stop scrolling, latest quotes will be fetched every 60 seconds for the visible crypto currencies on the screen
- There is a polling interval of 60 seconds for fetching 5000 CMC latest listings and store/persist it to the cache

### Notes:

- If you want to test rendering performance, must try with Release build on your Real device.

```
yarn ios:prod
```

- Try Production mode when testing on Dev build

```
yarn start:prod
```

- I'm using Async Storage this time because it's the most simple and straightforward apporach. However, if we really want to optimize searching performance or any operations related to storage aggregation, we can consider to have a local database such as Realm or WatermelonDB,...

## 💫 Demo

- Functional recording

## 🧱 Project structure

Manage custom android code

```
/android
```

Manage custom iOS code

```
/ios
```

Expo router defined folder for navigation

```
/app
```

Manage Typescript layer code

```
/src

--/components # app level common components
--/hooks # app level common hooks
--/theme # theme related global config such as fonts and colors

--/features # each feature should be modularized here for
--/--/screens # feature level screens
--/--/components # feature level common components
```

## 📲 Instructions

- Install dependencies and start the server

```
yarn && yarn start
```

- Run iOS

```
yarn ios
```

- Run Android

```
yarn android
```

- For linting (can be extended to be used in CI/CD and pre-commit)

```
yarn lint
```
