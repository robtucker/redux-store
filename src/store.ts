/**
 * External dependencies
 */
import { createStore, applyMiddleware, compose, Middleware, Store, StoreEnhancer } from 'redux'
import { routerMiddleware } from 'react-router-redux'
import { History, createBrowserHistory } from 'history'
import { default as thunk } from 'redux-thunk'
import { createEpicMiddleware } from 'redux-observable'
import { createLogger } from 'redux-logger'
import { composeWithDevTools } from 'redux-devtools-extension'

/**
 * Config interface
 */
import { ReduxStoreConfig } from './interfaces'

/**
 * redux-localstorage service
 */
import { default as persistState, mergePersistedState, StorageAdapter } from 'redux-localstorage'
import * as adapter from 'redux-localstorage/lib/adapters/localStorage'
import filter from 'redux-localstorage-filter'
import * as debounce from 'redux-localstorage-debounce'

/**
 * Export a reference to the history so that
 * it can be passed into the Router provider
 */
export const history: History = createBrowserHistory()

/**
 * Standardized way of creating a redux store
 * across all  applications
 *
 * @param config
 */
export const createReduxStore: (config: ReduxStoreConfig) => Store<any> = (config: ReduxStoreConfig) => {
    /**
     * Redux observable epic middleware with dependencies
     */
    const epicMiddleware = createEpicMiddleware({
        dependencies: config.epicDependencies,
    })

    /**
     * The hydrated reducer will contain all the saved data from localstorage
     * Any blanks will be filled in by the initialState for that reducer
     */
    const hydratedReducer = compose(mergePersistedState())(config.rootReducer)

    /**
     * An adapter for the browser's native localstorage
     * which is wrapped with methods such as filter and debounce
     */
    const storage: any = compose(
        (debounce as any)(100),
        filter(config.localStoragePaths || ['auth']),
    )(adapter(config.storage))

    /**
     * Middleware stack
     */
    const middleware: Middleware[] = [
        routerMiddleware(history),
        epicMiddleware,
        thunk,
    ]

    if (config.enableReduxLogger) {
        middleware.push(createLogger())
    }

    /**
     * Choose a composer function
     */
    const composer: any = config.enableReduxDevtools
        ? composeWithDevTools // compose including redux devtools
        : compose // the default redux compose function

    /**
     * Store enhancer
     */
    const enhancer: StoreEnhancer<Store<any>> = composer(
        applyMiddleware(...middleware),
        persistState(storage, config.localStorageKey || ''),
    )

    /**
     * Redux store
     */
    const store = createStore(
        hydratedReducer,
        enhancer,
    )

    /**
     * Run the epic middleware
     */
    epicMiddleware.run(config.rootEpic)

    return store
}