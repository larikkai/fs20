const supertest = require('supertest')
const mongoose = require('mongoose')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

describe('when there is initially some blogs saved', () => {

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

  test('a specific blog is within the returned blogs', async () => {
    const response = await api.get('/api/blogs')
    const titles = response.body.map(r => r.title)
    expect(titles).toContainEqual('Kimmon paivakirja')
  })

  describe('viewing a specific blog', () => {

    test('succeeds with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb()

      const blogToView = blogsAtStart[0]

      const resultBlog = await api
        .get(`/api/blogs/${blogToView.id}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

      expect(resultBlog.body).toEqual(blogToView)
    })

    test('fails with statuscode 400 id is invalid', async () => {
      const invalidId = '5a3d5da59070081a82a3445'

      await api
        .get(`/api/blogs/${invalidId}`)
        .expect(400)
    })
  })

  describe('addition of a new blog', () => {

    test('Where Rambo had his last massacre', async () => {
      const response = await api.get('/api/blogs')
      expect(response.body[2].title).toBe('Massagre in Taiwan')
    })

    test('a valid blog can be added', async () => {

      const newBlog = {
        title: 'async/await simplifies making async calls',
        author: 'Luukkainen',
        url: 'www.fso2020.io',
        likes: Number.MAX_SAFE_INTEGER,
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
        .set('Authorization', 'brearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI1ZTRhY2I0NjJmMGVlYzE2NjRkOGY0YjEiLCJpYXQiOjE1ODE5NzYyODF9.XtcIIyKFPqQsM46MyZdDH-z2VZHDsNLLo1yCZ2ndUdc')
        .send(newBlog)
        .expect(400)
      const response = await api.get('/api/blogs')
      expect(response.body.length).toBe(helper.initialBlogs.length)
    })
  })

  describe('deletion of a blog', () => {

    test('a blog can be deleted', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToDelete = blogsAtStart[0]

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .set('Authorization', 'brearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI1ZTRhY2I0NjJmMGVlYzE2NjRkOGY0YjEiLCJpYXQiOjE1ODE5NzYyODF9.XtcIIyKFPqQsM46MyZdDH-z2VZHDsNLLo1yCZ2ndUdc')
        .expect(204)

      const blogsAtEnd = await helper.blogsInDb()

      expect(blogsAtEnd.length).toBe(
        helper.initialBlogs.length - 1
      )

      const titles = blogsAtEnd.map(r => r.title)

      expect(titles).not.toContainEqual(blogToDelete.title)
    })
  })

  describe('addition of a new blog', () => {

    test('indentification field must be named id', async () => {
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
        .set('Authorization', 'brearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI1ZTRhY2I0NjJmMGVlYzE2NjRkOGY0YjEiLCJpYXQiOjE1ODE5NzYyODF9.XtcIIyKFPqQsM46MyZdDH-z2VZHDsNLLo1yCZ2ndUdc')
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
        .set('Authorization', 'brearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6Im1sdXVra2FpIiwiaWQiOiI1ZTRhY2I0NjJmMGVlYzE2NjRkOGY0YjEiLCJpYXQiOjE1ODE5NzYyODF9.XtcIIyKFPqQsM46MyZdDH-z2VZHDsNLLo1yCZ2ndUdc')
        .send(newBlog)
        .expect(400)
      const response = await helper.blogsInDb()
      expect(response.length).toBe(helper.initialBlogs.length)
    })

    test('After blog update, the number of likes is correct', async () => {
      const blogsAtStart = await helper.blogsInDb()
      const blogToUpdate = blogsAtStart[0]

      const updatedBlog = {
        title: blogToUpdate.title,
        author: blogToUpdate.author,
        url: blogToUpdate.url,
        likes: 1000
      }
      await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send(updatedBlog)
        .expect(200)
      await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

      const blogsAtEnd = await helper.blogsInDb()
      expect(blogsAtEnd.length).toBe(helper.initialBlogs.length)
      const likes = blogsAtEnd.map(r => r.likes)
      expect(likes).toContainEqual(1000)
    })
  })
})

describe('when there is initially two user at db', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    const user = new User({ username: 'root', name: 'Superuser', password: 'sekret' })
    await user.save()
    const user2 = new User({ username: 'mluukkai', name: 'Matti Luukkainen', password: 'salainen' })
    await user2.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkaii',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('`username` to be unique')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if username is less than 3 char', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'ro',
      name: 'Superuser',
      password: 'salainen',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('User validation failed: username: Path `username` (`ro`) is shorter than the minimum allowed length (3).')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })

  test('creation fails with proper statuscode and message if password is less than 3 char', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'root',
      name: 'Superuser',
      password: 'sa',
    }

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('password must be at least 3 characters long')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd.length).toBe(usersAtStart.length)
  })
})
afterAll(() => {
  mongoose.connection.close()
})