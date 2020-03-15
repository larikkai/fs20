require('dotenv').config()

const { ApolloServer, UserInputError, gql } = require('apollo-server')

const mongoose = require('mongoose')
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const jwt = require('jsonwebtoken')

const JWT_SECRET = process.env.JWT_SECRET

mongoose.set('useFindAndModify', false)

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

//const { v4: uuid } = require('uuid');

const typeDefs = gql`
  type Author {
    name: String!
    id: ID!
    born: Int
    bookCount: Int
    authorOf: [Book]
  }
  type Book {
    title: String!
    published: Int!
    author: Author!
    genres: [String!]!
    id: ID!
  }
  type Query {
    bookCount: Int!
    authorCount: Int!
    allBooks(author: String, genre: String): [Book!]!
    allAuthors: [Author!]!
    findAuthorsBooksCount(name: String!): Int
    me: User
  }
  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }
  type Token {
    value: String!
  }

  type Mutation {
    addBook(
      title: String!
      author: String!
      published: Int!
      genres: [String]!
    ): Book,
    addAuthor(
      name: String!
      born: Int
    ): Author,
    editAuthor(
      name: String!
      setBornTo: Int!
    ): Author,
    createUser(
      username: String!
      favoriteGenre: String!
    ): User,
    login(
      username: String!
      password: String!
    ): Token
  }

  type Subscription {
    bookAdded: Book!
  }   
`
const { PubSub } = require('apollo-server')
const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      if(args.author) {
        const authorToFind = await Author.findOne({ name: args.author})
        if (args.genre === undefined) {
          return await Book.find({author: authorToFind.id})
        }
          return Book.find({ author: authorToFind.id, genres: { $in: [args.genre] } })
        }
      if(args.genre) {
        return Book.find({ genres: { $in: [args.genre] } })
      }
      return Book.find({})
    },
    allAuthors: (root, args) => {
      return Author.find({})
    },
    findAuthorsBooksCount: (root, args) => Book.find({}).reduce((sum, book) => book.author === args.name ? sum + 1 : sum, 0),
    me: (root, args, context) => {
      return context.currentUser
    }
  },
  Author: {
    bookCount: async (root) => {
      const books = await Book.find({ author: root.id})
      return books.length
    }
  },
  Book: {
    author: async (root) => {
      return await Author.findById(root.author)
    }
  },
  Mutation: {
    addAuthor: async (root, args, context) => {
      const author = new Author({ ...args })
      const currentUser = context.currentUser

      if(!currentUser) {
        throw new AuthenticationError("not authenticated")
      }
      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
      })
    }
      return author
    },

    addBook: async (root, args, context) => {
      const currentUser = context.currentUser
      if(!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const authorToFind = await Author.findOne({ name: args.author })

      if(!authorToFind){
        const newAuthor = new Author({
          name: args.author,
          born: args.author.born
      })
      try {
        await newAuthor.save()
      } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }
      const author = await Author.findOne({ name: args.author })
      const book = new Book({ ...args, author: author })
      try {
        await book.save()
      } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
      
    editAuthor: async (root, args, context) => {
      const currentUser = context.currentUser
      if(!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author =  await Author.findOne({ name: args.name })
      author.born = args.setBornTo
      try {
        await author.save()
      } catch(error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }
      return author
    },
    createUser: (root, args) => {
      const user = new User({ ...args })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  },
}

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )
      const currentUser = await User
        .findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url, subscriptionsUrl }) => {
  console.log(`Server ready at ${url}`)
  console.log(`Subscriptions ready at ${subscriptionsUrl}`)
})