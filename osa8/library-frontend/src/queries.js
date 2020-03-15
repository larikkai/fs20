import { gql  } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    title
    author {name}
    published
    genres
  }
`

export const ALL_BOOKS = gql`
    query {
      allBooks {
        title
        author {name}
        published,
        genres
     }
   }
 `

export const ALL_AUTHORS = gql `
  query {
    allAuthors {
      name
      born
      bookCount
    }
  }
`

export const CREATE_BOOK = gql`
  mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String]!) {
    addBook(
      title: $title,
      author: $author,
      published: $published,
      genres: $genres
    ) {
      title
      author{name}
      published
    }
  }
`
export const UPDATE_AUTHOR = gql`
  mutation updateAuthor($author: String!, $bornYear: Int!) {
    editAuthor(
      name: $author,
      setBornTo: $bornYear
    ){
      name
      born
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password)  {
      value
    }
  }
`
export const RECOMMENDED_BOOKS = gql`
  query allRecommendedBooks($favGenre: String!) {
    allBooks(genre: $favGenre) {
      title
      author
      published
    }
  }
`

export const USER = gql`
  query {
    me {
      favoriteGenre
    }
  }
`
export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }
  
${BOOK_DETAILS}
`