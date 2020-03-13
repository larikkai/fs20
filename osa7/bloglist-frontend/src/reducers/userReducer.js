const userReducer = (state = null, action) => {
  switch (action.type) {
  case 'LOGIN_USER': {
    state = action.data
    return state
  }
  case 'LOGOUT_USER': {
    state = null
    return state
  }
  default:
    return state
  }
}

export const loginUser = (user) => {
  return async dispatch => {
    dispatch({
      type: 'LOGIN_USER',
      data: { user }
    })
  }
}

export const logoutUser = () => {
  return async dispatch => {
    dispatch({
      type: 'LOGOUT_USER'
    })
  }
}

export default userReducer