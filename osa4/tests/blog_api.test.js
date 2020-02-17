const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
  await Blog.deleteMany({})
  await Blog.insertMany(helper.initialBlogs)
  //const blogObjects = helper.initialBlogs.map(blog => new Blog(blog))
  //const promiseArray = blogObjects.map(blog => blog.save())
  //await Promise.all(promiseArray)
})

test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('a specific blog within the returned blogs', async () => {
  const response = await api.get('/api/blogs')
  const titles = response.body.map(r => r.title)
  expect(titles).toContainEqual('Kimmon paivakirja')
})

test('Where Rambo had his last massacre', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[2].title).toBe('Massagre in Taiwan')
})

test('a valid blog can be added ', async () => {
  const newBlog = {
    title: 'async/await simplifies making async calls',
    author: 'Luukkainen',
    url: 'www.fso2020.io',
    likes: Number.MAX_SAFE_INTEGER
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).toContainEqual(
    'async/await simplifies making async calls'
  )
})

test('blog without title is not added', async () => {
  const newBlog = {
    author: 'God',
    url: 'www.nevergointohappen.org',
    likes: 666
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  const response = await api.get('/api/blogs')
  expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('a specific blog can be viewed', async () => {
  const blogsAtStart = await helper.blogsInDb()

  const blogToView = blogsAtStart[0]

  const resultBlog = await api
    .get(`/api/blogs/${blogToView.id}`)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  expect(resultBlog.body).toEqual(blogToView)
})

test('a blog can be deleted', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToDelete = blogsAtStart[0]

  await api
    .delete(`/api/blogs/${blogToDelete.id}`)
    .expect(204)

  const blogsAtEnd = await helper.blogsInDb()

  expect(blogsAtEnd.length).toBe(
    helper.initialBlogs.length - 1
  )

  const titles = blogsAtEnd.map(r => r.title)

  expect(titles).not.toContainEqual(blogToDelete.title)
})

test('indentification field must be name id', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const ids = blogsAtStart.map(r => expect(r.id).toBeDefined())

  expect(ids).toBeDefined()
})

test('a blog witouht likes can be added', async () => {
  const newBlog = {
    title: 'Likes are overrated',
    author: 'Halonen',
    url: 'www.google.com',
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(200)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(r => r.title)
  expect(titles).toContainEqual(
    'Likes are overrated'
  )
  const likes = blogsAtEnd.map(r => r.likes)
  expect(likes).toContainEqual(0)
})

test('blog without url is not added', async () => {
  const newBlog = {
    title: 'Creating someting new',
    author: 'God',
    likes: 666
  }

  await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(400)
  const response = await helper.blogsInDb()
  expect(response.length).toBe(helper.initialBlogs.length)
})

afterAll(() => {
  mongoose.connection.close()
})