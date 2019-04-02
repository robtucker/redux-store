# redux-store

Helper for creating redux stores with redux-observable and redux-localstorage.

Designed for personal use only.

### Packages included

- rxjs
- react-router-redux
- redux
- redux-devtools-extension
- redux-localstorage
- redux-localstorage-debounce
- redux-localstorage-filter
- redux-logger
- redux-observable
- redux-thunk

### Usage

Install:

```
npm i -D @robtucker/redux-store
```

Create a configuration object for the store, and then use it:

```typescript
import { history, createReduxStore, ReduxStoreConfig } from '@robtucker/redux-store'
import { Provider, combineReducers } from 'redux'
import { ConnectedRouter } from 'react-router-redux'
import { combineEpics } from 'redux-observable'

const rootReducer = combineReducers({ [REDUCER_KEY]: testReducer })
const rootEpic = combineEpics()
const epicDependencies = {}

const config: ReduxStoreConfig = {
    window.localStorage,
    rootReducer,
    rootEpic
    epicDependencies,
    localStoragePaths: ['auth', 'etc'],
    localStorageKey: 'foo',
    enableReduxLogger: false,
    enableReduxDevtools: false,
}

const store = createReduxStore(config)

const App = () => (
    <Provider store={store}>
        <ConnectedRouter history={history}>
            <MyApp />
        </ConnectedRouter>
    </Provider>
)
```
