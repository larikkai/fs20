import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import loginForm from './components/loginForm'
import blogForm from './components/blogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [style, setStyle] = useState('neutral')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()
    try {
      const user = await loginService.login({
        username, password,
      })

      window.localStorage.setItem(
        'loggedBlogappUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setErrorMessage('wrong username or password')
      setStyle('error')
      handleErrorMessage()
    }
  }

  const handleLogout = (event) => {
    event.preventDefault()
    setUser(null)
    window.localStorage.removeItem('loggedBlogappUser')
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    
    try { 
      const blog = await blogService.create({
        title, author, url
      })
      setBlogs(blogs.concat(blog))
      setErrorMessage(`a new blog ${title} by ${author} added`)
      handleErrorMessage()
      setTitle('')
      setAuthor('')
      setUrl('')
    } catch (exception) {
        setErrorMessage('virhe')
        setStyle('error')
        handleErrorMessage()
      }
    }

  const handleErrorMessage = () =>{
    setTimeout(() => {
        setErrorMessage(null)
        setStyle('neutral')
    }, 4000)
  }

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} style={style} />
        {loginForm({username, setUsername, password, setPassword, handleLogin})}
      </div>
    )
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} style={style}/>
      <p>{user.name} logged in
      <button onClick={handleLogout}>logout</button>
      </p>
      <h2>create new </h2>
      {blogForm({ handleNewBlog, title, setTitle, author, setAuthor, url, setUrl })}

      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
    </div>
  )
}

export default App