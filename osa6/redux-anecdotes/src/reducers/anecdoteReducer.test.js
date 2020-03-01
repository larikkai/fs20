import deepFreeze from 'deep-freeze'
import reducer, { voteAnecdote } from './anecdoteReducer'

describe('anecdote reducer', () => {

  test('anecdote can be added', () => {
      const state = []
      const action = {
          type: 'NEW_ANECDOTE',
          content: 'test anecdotes are usefull',
          id: 1,
          votes: 0
      }
      deepFreeze(state)
      const newState = reducer(state, action)
      expect(newState.length).toBe(1)
      expect(newState).toContainEqual(state[0])
  })
    
  test('anecdote can be voted', () => {
    const state = [
      {
        content: 'test anecdote',
        id: 1,
        votes: 0
      },
      {
        content: 'anecdote test2',
        id: 2,
        votes: 0
      }
    ]
      const action = {
        type: 'VOTE',
        data: {
            id: 2
        }
      }

      deepFreeze(state)

      const newState = reducer(state, action)

      expect(newState.length).toBe(2)
      expect(newState).toContainEqual(state[0])
      expect(newState).toContainEqual({
          content: 'anecdote test2',
          id: 2,
          votes: 1
      })
        
  })
})