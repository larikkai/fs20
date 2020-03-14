  
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { UPDATE_AUTHOR, ALL_AUTHORS } from '../queries'

import Select from 'react-select';

const Authors = (props) => {
  const [author, setAuthor] = useState('')
  const [bornYear, setBornYear] = useState('')

  const [ updateAuthor ] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [ { query: ALL_AUTHORS } ]
  })

  if (!props.show) {
    return null
  }

  if(!props.authors) {
    return (
      <div>
        <h2>authors</h2>
        <p>loading...</p>
      </div>
    )
  }

  const authors = props.authors.allAuthors

  const changeName = async (event) => {
    event.preventDefault()

    updateAuthor({ variables: { author, bornYear } })

    setAuthor('')
    setBornYear('')
  }

  const options = authors.map(author => ({
    value: author.name,
    label: author.name
  }))

  const handleChange = author => {
    setAuthor(author.value)
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>
              born
            </th>
            <th>
              books
            </th>
          </tr>
          {authors.map(a =>
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          )}
        </tbody>
      </table>
      <h2>Set birthyear</h2>
      <form onSubmit={changeName}>
        <div>
          <Select
            value={ author }
            onChange={ handleChange }
            options={options}
           />
        </div>
        <div>
          born
          <input
          value={bornYear}
          onChange={ ({ target }) => setBornYear(Number(target.value)) }>
          </input>
        </div>
        <button type='submit'>update author</button>
      </form>
    </div>
  )
}

export default Authors
