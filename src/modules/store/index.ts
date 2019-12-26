import { routerMiddleware } from 'connected-react-router'
import { applyMiddleware, createStore } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension/developmentOnly'
import thunk from 'redux-thunk'

import rootReducer from '../index'
import history from './history'

const __PRODUCTION__ = process.env.NODE_ENV === 'production'

const composeEnhancers = composeWithDevTools({})

const configureStore = (initialState: object = {}) => {
  const router = routerMiddleware(history)

  const middlewares = [thunk, router]
  if (!__PRODUCTION__) {
    const logger = require('redux-logger').default
    middlewares.push(logger)
  }
  // tslint:disable-next-line:no-shadowed-variable
  const store = createStore(rootReducer, initialState, composeEnhancers(applyMiddleware(...middlewares)))
  return store
}

export const store = configureStore()
export default configureStore
