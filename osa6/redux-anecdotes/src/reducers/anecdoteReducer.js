import anecdoteService from '../services/anecdotes'

const reducer = (state = [], action) => {
  switch (action.type) {
  case 'NEW_ANECDOTE': {
    return [...state, action.data]
  }
  case 'INIT_ANECDOTES': {
    return action.data
  }
  case 'VOTE': {
    const id = action.data.id
    const changedAnecdote = action.data.votedAnecdote
    return state.map(anecdote =>
      anecdote.id !== id ? anecdote : changedAnecdote
    )
  }
  default:
    return state
  }
}

export const voteAnecdote = (id) => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    const anecdoteToVote = anecdotes.find(anecdote => anecdote.id === id)
    const updatedAnecdote = { ...anecdoteToVote, votes: anecdoteToVote.votes + 1 }
    const votedAnecdote = await anecdoteService.update(id, updatedAnecdote)
    dispatch({
      type: 'VOTE',
      data: { id, votedAnecdote }
    })
  }
}

export const createAnecdote = content => {
  return async dispatch => {
    const newAnecdote = await anecdoteService.create(content)
    dispatch({
      type: 'NEW_ANECDOTE',
      data: newAnecdote
    })
  }
}

export const initializeAnecdotes = () => {
  return async dispatch => {
    const anecdotes = await anecdoteService.getAll()
    dispatch({
      type: 'INIT_ANECDOTES',
      data: anecdotes
    })
  }
}

export default reducer