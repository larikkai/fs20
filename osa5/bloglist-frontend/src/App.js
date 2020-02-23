import React, { useState, useEffect } from 'react'
import Blog from './components/Blog'
import Notification from './components/Notification'
import blogService from './services/blogs'
import loginService from './services/login'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Togglable from './components/Togglable'
const App = () => {
  const [blogs, setBlogs] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [style, setStyle] = useState('neutral')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs(blogs.sort((curr, prev) => prev.likes-curr.likes) )
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

  const addBlog = async (blogObject) => {
    try {
      const addedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(addedBlog))
      setErrorMessage(`a new blog ${blogObject.title} by ${blogObject.author} added`)
      handleErrorMessage()
    } catch (exception) {
      setErrorMessage('virhe')
      setStyle('error')
      handleErrorMessage()
    }
  }

  const handleLike = async (id) => {
    const blog = blogs.find(blog => blog.id === id)
    const likedBlog = {
      user: blog.user.id,
      likes: blog.likes + 1 || 0,
      author: blog.author,
      title: blog.title,
      url: blog.url
    }
    try {
      const updatedBlog = await blogService.update(id, likedBlog)
      setBlogs(blogs
        .map(blog => blog.id !== id ? blog : updatedBlog)
        .sort((curr, prev) => prev.likes-curr.likes) )
    } catch (exeption) {
      setErrorMessage('virhe')
      setStyle('error')
      handleErrorMessage()
    }
  }


  const handleRemove = async (id) => {
    const blogToRemove = blogs.find(blog => blog.id === id)
    if(window.confirm(`Remove ${blogToRemove.title} by ${blogToRemove.author}`)){
      try {
        const removedBlog = await blogService.remove(id)
        console.log(removedBlog)
        setBlogs(blogs.filter(blog => blog.id !== id))
      } catch (exeption) {
        setErrorMessage('Blog was already removed')
        setStyle('error')
        handleErrorMessage()
      }
    }
  }

  const blogFormRef = React.createRef()

  const blogForm = () => (
    <Togglable buttonLabel='new blog' ref={blogFormRef}>
      <BlogForm createBlog={addBlog}/>
    </Togglable>
  )

  const handleErrorMessage = () => {
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
        <Togglable buttonLabel='login'>
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleSubmit={handleLogin}
          />
        </Togglable>
      </div>
    )
  }
  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} style={style}/>
      <p>{user.name} logged in</p>
      <button onClick={handleLogout}>logout</button>
      {blogForm()}
      {blogs.map((blog, i) =>
        <Blog
          key={i}
          blog={blog}
          handleLike={() => handleLike(blog.id)}
          handleRemove={() => handleRemove(blog.id)}/>
      )}
    </div>
  )
}

export default App