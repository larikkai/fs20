import React, { useState, useEffect } from 'react'

const Books = (props) => {
  const [genre, setGenre] = useState(null)
  const [favGenre, setFavGenre] = useState(null)

  useEffect(() => {
    if(props.user){
      setFavGenre(props.user.favoriteGenre)
    }
  }, [props.user])

  if (!props.show) {
    return null
  }

  if(!props.books) {
    return (
      <div>
        <h2>books</h2>
        <p>loading...</p>
      </div>
    )
  }

  let books = props.books.allBooks

  if(props.user) {
    books = books.filter(book => book.genres.includes(favGenre))
    return (
      <div>
      <h2>recommendations</h2>
      <p>books in your favorite genre <b>{favGenre}</b></p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => {
        setGenre('refactoring')
        props.setPage('books')}}>refactoring</button>
      <button onClick={() => {
        setGenre('agile')
        props.setPage('books')}}>agile</button>
      <button onClick={() => {
        setGenre('patterns')
        props.setPage('books')}}>patters</button>
      <button onClick={() => {
        setGenre('desing')
        props.setPage('books')}}>design</button>
      <button onClick={() => {
        setGenre('crime')
        props.setPage('books')}}>crime</button>
      <button onClick={() => {
        setGenre('classic')
        props.setPage('books')}}>classic</button>
      <button onClick={() => { 
        setGenre('test') 
        props.setPage('books')}}>test</button>
      <button onClick={() => {
        setGenre(null)
        props.setPage('books')}}>all genres</button>
      </div>
    )
  }

  if(genre){
    books = books.filter(book => book.genres.includes(genre))

    return (
      <div>
        <h2>books</h2>
        <p>in genre <b>{genre}</b></p>
        <table>
          <tbody>
            <tr>
              <th></th>
              <th>
                author
              </th>
              <th>
                published
              </th>
            </tr>
            {books.map(a =>
              <tr key={a.title}>
                <td>{a.title}</td>
                <td>{a.author.name}</td>
                <td>{a.published}</td>
              </tr>
            )}
          </tbody>
        </table>
        <button onClick={() => setGenre('refactoring')}>refactoring</button>
        <button onClick={() => setGenre('agile')}>agile</button>
        <button onClick={() => setGenre('patterns')}>patterns</button>
        <button onClick={() => setGenre('desing')}>desing</button>
        <button onClick={() => setGenre('crime')}>crime</button>
        <button onClick={() => setGenre('classic')}>classic</button>
        <button onClick={() => setGenre('test')}>test</button>
        <button onClick={() => setGenre(null)}>all genres</button>
      </div>
    )
  }

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              author
            </th>
            <th>
              published
            </th>
          </tr>
          {books.map(a =>
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          )}
        </tbody>
      </table>
      <button onClick={() => setGenre('refactoring')}>refactoring</button>
      <button onClick={() => setGenre('agile')}>agile</button>
      <button onClick={() => setGenre('patterns')}>patterns</button>
      <button onClick={() => setGenre('desing')}>desing</button>
      <button onClick={() => setGenre('crime')}>crime</button>
      <button onClick={() => setGenre('classic')}>classic</button>
      <button onClick={() => setGenre('test')}>test</button>
      <button onClick={() => setGenre(null)}>all genres</button>
    </div>
  )
}

export default Books