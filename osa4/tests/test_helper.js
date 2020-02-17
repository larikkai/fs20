const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: 'Kimmon paivakirja',
    author: 'Kimmo',
    url: 'www.google.com',
    likes: 999,
  },
  {
    title: 'Massangre in China',
    author: 'Rambo, John',
    url: 'www.google.com',
    likes: 199
  },
  {
    title: 'Massagre in Taiwan',
    author: 'Rambo, John',
    url: 'www.google.com',
    likes: 100
  }
]

const nonExistingId = async () => {
  const blog = new Blog({ title: 'willremovethissoon' })
  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
}