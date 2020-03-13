import blogService from '../services/blogs'

const byLikes = (b1, b2) => b2.likes - b1.likes

const blogReducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_BLOG': {
    return [...state, action.data]
  }
  case 'INIT_BLOGS': {
    return action.data.sort(byLikes)
  }
  case 'LIKE': {
    const likedBlogi = action.data.updatedBlog
    const likedBlog = { ...likedBlogi, user: action.data.user }
    console.log(likedBlog)
    return state.map(blog => blog.id !== likedBlog.id ? blog : likedBlog).sort(byLikes)
  }
  case 'REMOVE_BLOG': {
    const id = action.data.id
    return state.filter(blog => blog.id !== id)
  }
  default:
    return state
  }
}

export const likeBlog = (blog, user) => {
  return async dispatch => {
    const updatedBlog = await blogService.update(blog)
    dispatch({
      type: 'LIKE',
      data: { updatedBlog, user }
    })
  }
}

export const createBlog = content => {
  return async dispatch => {
    const newBlog = await blogService.create(content)
    dispatch ({
      type: 'NEW_BLOG',
      data: newBlog
    })
  }
}

export const removeBlog = id => {
  return async dispatch => {
    await blogService.remove(id)
    dispatch({
      type: 'REMOVE_BLOG',
      data: { id }
    })
  }
}

export const initializeBlogs = () => {
  return async dispatch => {
    const blogs = await blogService.getAll()
    dispatch({
      type: 'INIT_BLOGS',
      data: blogs
    })
  }
}

export default blogReducer