import { createReduxStore, ReduxStoreConfig } from '../src'
import { combineReducers } from 'redux'
import { combineEpics } from 'redux-observable'

// a mock of window.localStorage
const mockLocalStorage: Storage = {
    length: 0,
    clear: () => { },
    getItem: (key: string) => null,
    key: (index: number) => null,
    removeItem: (key: string) => { },
    setItem: (key: string, data: string) => { },
}

it('should create a new store', () => {

    const exampleState = { foo: 'bar' }
    const REDUCER_KEY = 'test'
    const testReducer = (state: any, action: any) => exampleState

    const rootReducer = combineReducers({ [REDUCER_KEY]: testReducer })
    const epicDependencies = {}

    const config: ReduxStoreConfig = {
        storage: mockLocalStorage,
        rootReducer,
        rootEpic: combineEpics(),
        epicDependencies,
        localStoragePaths: [],
        localStorageKey: '',
        enableReduxLogger: true,
        enableReduxDevtools: true,
    }
    const store = createReduxStore(config)
    const state = store.getState()
    expect(state[REDUCER_KEY]).toEqual(exampleState)
})