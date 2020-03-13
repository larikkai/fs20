import React from 'react'
import {
  BrowserRouter as Router,
  Switch, Route, Link, //useRouteMatch, useParams, Redirect
} from 'react-router-dom'
import Users from './Users'
import BlogList from './BlogList'
import Togglable from './Togglable'
import NewBlog from './NewBlog'
import { createBlog } from '../reducers/blogReducer'
import { useDispatch } from 'react-redux'

const Menu = ({ notifyWith }) => {

  const padding = {
    paddingRight: 5
  }

  const dispatch = useDispatch()
  const blogFormRef = React.createRef()
  const addNewBlog = (blog) => {
    blogFormRef.current.toggleVisibility()
    dispatch(createBlog(blog))
    notifyWith(`a new blog '${blog.title}' by ${blog.author} added!`)
  }

  return (
    <Router>
      <div>
        <Link style={padding} to="/users">users</Link>
        <Link style={padding} to="/">home</Link>
      </div>
      <Switch>
        <Route path="/user/:id">
        </Route>
        <Route path="/users">
          <Users />
        </Route>
        <Route path="/">
          <Togglable buttonLabel='create new blog'  ref={blogFormRef}>
            <NewBlog createBlog={addNewBlog} />
          </Togglable>
          <BlogList />
        </Route>
      </Switch>
    </Router>
  )
}

export default Menu