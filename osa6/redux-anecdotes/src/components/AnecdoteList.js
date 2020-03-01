import React from 'react'
import { voteAnecdote } from '../reducers/anecdoteReducer'
import { notificationChange } from '../reducers/notificationReducer'
import { useSelector, useDispatch } from 'react-redux'

const AnecdoteList = (props) => {
  const dispatch = useDispatch()
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    if( filter === '') {
      return anecdotes.sort((a, b) => b.votes - a.votes)
    }
    return anecdotes
      .filter(anecdote => anecdote.content.toLowerCase().includes(filter))
      .sort((a, b) => b.votes - a.votes)
  })
  
  const vote = (id) => {
    console.log('vote', id)
    const anecdote = anecdotes.find(anecdote => anecdote.id === id)
    console.log(anecdote.content)
    dispatch(voteAnecdote(id))
    dispatch(notificationChange(`you voted '${anecdote.content}'`))
    handleNotification()
  }

  const handleNotification = () =>{
    setTimeout(() => {
        dispatch(notificationChange(null))
    }, 5000)
  }

  return (
    <div>
      {anecdotes.map(anecdote =>
        <div key={anecdote.id}>
          <div>
            {anecdote.content}
          </div>
          <div>
            has {anecdote.votes}
            <button onClick={() => vote(anecdote.id)}>vote</button>
          </div>
        </div>
      )}
    </div>
  )
}
export default AnecdoteList