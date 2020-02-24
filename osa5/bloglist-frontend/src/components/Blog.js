import React, { useState } from 'react'

const Blog = ({ blog, handleLike, handleRemove }) => {
  const [visible, setVisible] = useState(false)
  const hideWhenVisible = { display: visible ? 'none' : '' }
  const showWhenVisible = { display: visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible}>
        <button onClick={() => setVisible(true)}>{blog.title} {blog.author}</button>
      </div>
      <div style={showWhenVisible}>
        <div>
          <button onClick={() => setVisible(false)}>{blog.title} {blog.author}</button>
        </div>
        <div>
          {blog.url}
        </div>
        <div>
          likes {blog.likes}
          <button id="like-button" onClick={handleLike}>like</button>
        </div>
        <div>
          {blog.user.name}
        </div>
        <div>
          <button id="remove-button" onClick={handleRemove}>Remove</button>
        </div>
      </div>
    </div>
  )
}

export default Blog
