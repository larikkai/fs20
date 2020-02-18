const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const bcrypt = require('bcrypt')
const api = supertest(app)

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

const newUserAndLoginReturnToken = async () => {
  const saltRounds = 10
  const passwordHash = await bcrypt.hash('salainen', saltRounds)

  const userToAdd = new User({
    username: 'mluukkai',
    name: 'Matti',
    passwordHash
  })
  const userToLogin = await userToAdd.save()

  const result = await api
    .post('/api/login')
    .send({
      username: userToLogin.username,
      password: 'salainen'
    })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  return result.body.token
}

const addNewBlog = async (token) => {

  const blog = {
    author: 'God',
    title: 'John Ramp',
    url: 'www.nevergointohappen.org',
    likes: 666
  }

  await api
    .post('/api/blogs')
    .send(blog)
    .set({
      'Content-Type': 'application/json',
      Authorization: `bearer ${token}` })
    .expect(200)
    .expect('Content-Type', /application\/json/)
}

module.exports = {
  initialBlogs,
  nonExistingId,
  blogsInDb,
  usersInDb,
  newUserAndLoginReturnToken,
  addNewBlog
}