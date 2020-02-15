const mongoose = require('mongoose')

if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://fullstack:${password}@cluster0-ziluf.mongodb.net/blogilista-app?retryWrites=true&w=majority`

mongoose.connect(url, { useNewUrlParser: true, useUnifiedTopology: true })

const blogSchema = mongoose.Schema({
    title: String,
    author: String,
    url: String,
    likes: Number
  })
  
const Blog = mongoose.model('Blog', blogSchema)

if ( process.argv.length === 3 ){
    Blog
        .find({})
        .then(result => {result.forEach(blog => {
            console.log(blog)
        })
        mongoose.connection.close()
    })
}

if ( process.argv.length > 3 ){
    const blog = new Blog({
        title: process.argv[3],
        author: process.argv[4],
        url: process.argv[5],
        likes: process.argv[6],
    })

    blog.save().then(response => {
        console.log('blog saved');
        mongoose.connection.close();
    })
}