import { createStore, combineReducers } from 'redux'
import reducer from './reducers/anecdoteReducer'
import notificationReducer from './reducers/notificationReducer'
import filterChange from './reducers/filterReducer'
import { composeWithDevTools } from 'redux-devtools-extension'


const combineReducer = combineReducers({
    anecdotes: reducer,
    notification: notificationReducer,
    filter: filterChange
})

const store = createStore(combineReducer, composeWithDevTools())

export default store