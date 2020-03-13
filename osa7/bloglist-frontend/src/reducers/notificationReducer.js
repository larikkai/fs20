const notificationReducer = (state = null, action) => {
  switch (action.type) {
  case 'SET_NOTIFICATION':
    return action.notification
  case 'SET_NULL':
    return null
  default:
    return state
  }
}

let timeoutID

export const setNotification = (notification, time) => {
  clearTimeout(timeoutID)
  return async dispatch => {
    dispatch({
      type: 'SET_NOTIFICATION',
      notification
    })
    timeoutID = setTimeout(() => {
      dispatch({
        type: 'SET_NULL',
      })
    }, time*1000)
  }
}

export default notificationReducer