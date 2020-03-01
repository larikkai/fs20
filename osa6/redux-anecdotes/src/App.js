import React from 'react'
import AnecdoteList from './components/AnecdoteList'
import NewAnecdote from './components/AnecdoteForm'

const App = () => {

  return (
    <div>
      <h2>Anecdotes</h2>
      <AnecdoteList />
      <NewAnecdote />
    </div>
  )
}

export default App