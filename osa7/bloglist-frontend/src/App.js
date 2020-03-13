import React, { useState, useEffect } from 'react'
import Notification from './components/Notification'

import loginService from './services/login'
import storage from './utils/storage'

import { useSelector, useDispatch } from 'react-redux'
import { setNotification } from './reducers/notificationReducer'
import { initializeBlogs } from './reducers/blogReducer'
import { loginUser, logoutUser } from './reducers/userReducer'

import Menu from './components/Menu'

const Header = ({ user, handleLogout }) => (
  <div>
    <h2>blogs</h2>
    <Notification />
    <p> {user.user.name} logged in </p>
    <button onClick={handleLogout}>logout</button>
    <Menu />
  </div>
)

const App = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeBlogs())
  }, [dispatch])

  useEffect(() => {
    //const user = storage.loadUser()
    //dispatch(loginUser(user))
  }, [dispatch])

  const user = useSelector(state => state.user)

  const notifyWith = (message) => {
    dispatch(setNotification( message, 10 ))
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password
      })

      setUsername('')
      setPassword('')
      dispatch(loginUser(user))
      notifyWith(`${user.name} welcome back!`)
      storage.saveUser(user)
    } catch(exception) {
      notifyWith('wrong username/password', 'error')
    }
  }

  const handleLogout = () => {
    dispatch(logoutUser())
    notifyWith(null)
    storage.logoutUser()
  }

  if ( !user ) {
    return (
      <div>
        <h2>login to application</h2>

        <Notification />

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              id='username'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              id='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button id='login'>login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Header user={user} handleLogout={handleLogout} notifyWith={notifyWith} />
    </div>
  )
}

export default App