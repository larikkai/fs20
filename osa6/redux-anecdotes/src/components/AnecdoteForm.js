import React from 'react'
import { createAnecdote } from '../reducers/anecdoteReducer'
import { useDispatch } from 'react-redux'

const NewAnecdote = () => {
  const dispatch = useDispatch()

  const addAnecdote = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    dispatch(createAnecdote(content))
  }
  return (
    <div>
      <h2>create new</h2>
      <form onSubmit={addAnecdote}>
        <input name='anecdote'/>
        <button type='submit'>create</button>
      </form>
    </div>
  )
}
export default NewAnecdote