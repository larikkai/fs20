import React, { useState } from 'react'

import {
  BrowserRouter as Router,
  Switch, Route, Link, useRouteMatch, useParams, Redirect
} from "react-router-dom"

import { useField } from './hooks'

const Menu = ({ anecdotes, anecdote, addNew, newAnecdote, message, setNewAnecdote }) => {
  const padding = {
    paddingRight: 5
  }
  return (
    <Router>
      <div>
        <Link style={padding} to="/">anecdotes</Link>
        <Link style={padding} to="/create">create new</Link>
        <Link style={padding} to="/about">about</Link>
      </div>
      <Notification message={message} />
      <Switch>
        <Route path="/anecdotes/:id">
          <Anecdote anecdotes={anecdotes} />
        </Route>
        <Route path="/create">
          {newAnecdote ? <Redirect to="/" /> : <CreateNew addNew={addNew}/>}
        </Route>
        <Route path="/about">
          <About />
        </Route>
        <Route path="/">
          <AnecdoteList anecdotes={anecdotes} setNewAnecdote={setNewAnecdote} />
        </Route>
      </Switch>
    </Router>
  )
}

const Anecdote = ({ anecdotes }) => {
  const id = useParams().id
  const anecdote = anecdotes.find(anecdote => anecdote.id === id)
  return (
    <div>
      <h2>{ anecdote.content } by {anecdote.author }</h2>
      <p>has { anecdote.votes } votes</p>
      for more info see  <a href={`${ anecdote.info }`} >{ anecdote.info }</a>
  </div>
  )
}

const AnecdoteList = ({ anecdotes, setNewAnecdote }) => {
  setNewAnecdote('')
  return (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => 
      <li key={anecdote.id} >
        <Link to={`/anecdotes/${anecdote.id}`}>{anecdote.content}</Link>
        </li>
        )}
    </ul>
  </div>
)
      }

const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

const Footer = () => (
  <div>
    Anecdote app for <a href='https://courses.helsinki.fi/fi/tkt21009'>Full Stack -websovelluskehitys</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2019/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

const CreateNew = (props) => {
  const noReset = ({ reset, ...rest }) => rest
  const c = useField('text')
  const content = noReset(c)
  const a = useField('text')
  const author = noReset(a)
  const i = useField('text')
  const info = noReset(i)


  const handleSubmit = (e) => {
    e.preventDefault()
    props.addNew({
      content: content.value,
      author: author.value,
      info: info.value,
      votes: 0
    })
  }

  const handleReset = (e) => {
    e.preventDefault()
    c.reset()
    a.reset()
    i.reset()
  }

  return (
    <div>
      <h2>create a new anecdote</h2>
      <form onSubmit={handleSubmit}>
        <div>
          content
          <input {...content}/>
        </div>
        <div>
          author
          <input {...author} />
        </div>
        <div>
          url for more info
          <input {...info} />
        </div>
          <button>create</button>
          <button onClick={handleReset}>reset</button>
      </form>
    </div>
  )

}

const Notification = ({ message }) => {
  if(message === '') return null
  return (
    <div>
      a new anecdote {message} created!
    </div>
  )
}

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: '1'
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: '2'
    }
  ])

  const [ newAnecdote, setNewAnecdote ] = useState('')

  const [notification, setNotification] = useState('')

  const handleNotification = ( content ) => {
    setNotification(content)
    setTimeout(() => {
      setNotification('')
    }, 10000)
  }

  const addNew = (anecdote) => {
    setNewAnecdote(anecdote)
    anecdote.id = (Math.random() * 10000).toFixed(0)
    setAnecdotes(anecdotes.concat(anecdote))
    handleNotification(anecdote.content)
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  const match = useRouteMatch('/anecdotes/:id')
  const anecdote = match ? anecdotes.find(anecdote => anecdote.id === match.params.id) : null

  return (
    <div>
      <h1>Software anecdotes</h1>
      <Menu anecdotes={anecdotes} anecdote={anecdote} addNew={addNew} 
      newAnecdote={newAnecdote} message={notification} setNewAnecdote={setNewAnecdote}/>
      <Footer />
    </div>
  )
}

export default App;
