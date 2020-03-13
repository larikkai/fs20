import { createStore, combineReducers, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import notificationReducer from './reducers/notificationReducer'
import blogsReducer from './reducers/blogReducer'
import userReducer from './reducers/userReducer'

const combineReducer = combineReducers({
  notification: notificationReducer,
  blogs: blogsReducer,
  user: userReducer
})

const store = createStore(
  combineReducer,
  composeWithDevTools(
    applyMiddleware(thunk)
  ))

export default store