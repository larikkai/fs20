const dummy = (blogs) => {
  return 1
}
const totalLikes = (blogs) => {
  return blogs === null ? 0 : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}
const favoriteBlog = (blogs) => {
  return blogs.reduce((prev, curr) => prev.likes > curr.likes ? prev : curr, 0)
}
const bloggerWithMostBlogs = (blogs) => {
  const bloggers = blogs
    .map(blog => blog)
    .reduce((authors, blog) => {
      authors[blog.author] = authors[blog.author] || []
      authors[blog.author] = (
        {
          blog: authors[blog.author].blog + 1 || 1,
          //likes: authors[blog.author].likes + blog.likes || blog.likes
        })
      return authors
    }, {})
  const bl = []
  for( let [key, value] of Object.entries(bloggers)){
    bl.push({
      author: key,
      blogs: value.blog,
      //likes: value.likes
    })
  }
  const blogger = bl.reduce((prev, curr) => prev.blogs > curr.blog ? prev : curr, 0)
  return blogger
}

const bloggerWithMostLikes = (blogs) => {
  const bloggers = blogs
    .map(blog => blog)
    .reduce((authors, blog) => {
      authors[blog.author] = authors[blog.author] || []
      authors[blog.author] = (
        {
        //blog: authors[blog.author].blog + 1 || 1,
          likes: authors[blog.author].likes + blog.likes || blog.likes
        })
      return authors
    }, {})
  const bl = []
  for( let [key, value] of Object.entries(bloggers)){
    bl.push({
      author: key,
      //blogs: value.blog,
      likes: value.likes
    })
  }
  const blogger = bl.reduce((prev, curr) => prev.likes > curr.likes ? prev : curr, 0)
  return blogger
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  bloggerWithMostBlogs,
  bloggerWithMostLikes
}