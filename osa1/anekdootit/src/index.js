import React, { useState } from 'react'
import ReactDOM from 'react-dom'

const Button = ({ onClick, text}) => <button onClick={onClick}>{text}</button>

const Header = ({ text }) => <h1>{text}</h1>

const Display = ({ text, vote }) => {
    return (
        <div>
            {text}
            <br></br>
            has {vote} votes
        </div>
    )
}

const App = (props) => {
  const [selected, setSelected] = useState(0)
  const [vote, setVote] = useState(new Array(6).fill(0))
  const [mostV, setMostV] = useState(0)

  const handleClick = () => {
      const r = Math.floor(Math.random()*6)
      setSelected(r)
  }

  const handleVote = (newv) => {
      const votes = [...vote]
      votes[newv] += 1
      if(votes[newv] > votes[mostV]) setMostV(newv)
      setVote(votes)
  }

  return (
    <div>
        < Header text={'Anecdote of the day'} />
        < Display text={props.anecdotes[selected]} vote={vote[selected]} />
        < Button onClick={() => handleVote(selected)} text={'vote'} />
        < Button onClick={handleClick} text={'next anecdote'} />
        < Header text={'Anecdote with most votes'} />
        < Display text={props.anecdotes[mostV]} vote={vote[mostV]} />
    </div>
  )
}

const anecdotes = [
  'If it hurts, do it more often',
  'Adding manpower to a late software project makes it later!',
  'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
  'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
  'Premature optimization is the root of all evil.',
  'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
]

ReactDOM.render(
  <App anecdotes={anecdotes} />,
  document.getElementById('root')
)
