import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import reducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import filterChange from './reducers/filterReducer'

const combineReducer = combineReducers({
  anecdotes: reducer,
  notification: notificationReducer,
  filter: filterChange
})

const store = createStore(
  combineReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  ))

export default store