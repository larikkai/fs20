
import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import { useQuery, useApolloClient, useLazyQuery, useSubscription } from '@apollo/client'
import { ALL_AUTHORS, ALL_BOOKS, USER, BOOK_ADDED} from './queries'
import LoginForm from './components/LoginForm'

const Notify = ({ errorMessage }) => {
  if ( !errorMessage ) {
    return null
  }

  return (
    <div style={{color: 'red'}}>
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [token, setToken] = useState(null)
  const [page, setPage] = useState('authors')
  const [errorMessage, setErrorMessage] = useState(null)

  const [getUser, result] = useLazyQuery(USER)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (result.data){
      setUser(result.data.me)
    }
  }, [result])

  const bookResult = useQuery(ALL_BOOKS)
  const authorsResult = useQuery(ALL_AUTHORS)
  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })
    if (!includedIn(dataInStore.allBooks, addedBook)) {
      client.writeQuery({
        query: ALL_BOOKS,
        data: { allBooks : dataInStore.allBooks.concat(addedBook) }
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      window.alert(`${addedBook.title} added`)
      updateCacheWith(addedBook)
    }
  })

  if (!token) {

    return (
      <div>
        <div>
          <button onClick={() => setPage('authors')}>authors</button>
          <button onClick={() => setPage('books')}>books</button>
          <button onClick={() => setPage('login')}>login</button>
        </div>
        <div>
          <Notify errorMessage={errorMessage} />
          <LoginForm
            show={page === 'login'}
            setToken={setToken}
            setError={notify}
            setPage={setPage}
            token={token}
          />
          <Authors
            show={page === 'authors'}
            authors={authorsResult.data}
          />

          <Books
            show={page === 'books'}
            books={bookResult.data}
          />
        </div>
      </div>
    )
  }

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        <button onClick={() => setPage('add')}>add book</button>
        <button onClick={() => {
          setPage('recom_books')
          getUser()
        }}>recommended</button>
        <button onClick={logout} >logout</button>
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors
        show={page === 'authors'}
        authors={authorsResult.data}
      />

      <Books
        show={page === 'books'}
        books={bookResult.data}
      />

      <Books
        show={page === 'recom_books'}
        books={bookResult.data}
        token={token}
        user={user}
        setPage={setPage}
      />

      <NewBook
        show={page === 'add'}
        setError={notify}
        updateCacheWith={updateCacheWith}
      />

    </div>
  )
}

export default App