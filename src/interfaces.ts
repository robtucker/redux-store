import { Reducer } from 'redux'
import { Epic } from 'redux-observable'

export interface ReduxStoreConfig {
    storage: Storage // normally window.localStorage
    rootReducer: Reducer<any>,
    rootEpic: Epic<any, any>,
    epicDependencies: any,
    localStoragePaths?: string[]
    localStorageKey?: string
    enableReduxDevtools?: boolean
    enableReduxLogger?: boolean
}