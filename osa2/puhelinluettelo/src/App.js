import React, { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Persons from './components/Persons'
import PersonForm from './components/PersonForm'
import personService from './services/persons'
import Notification from './components/Notification'

const App = () => {
  const [ persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ newFilter, setNewFilter ] = useState('')
  const [ errorMessage, setErrorMessage] = useState(null)
  const [ style, setStyle] = useState('neutral')

  useEffect(() => {
      personService
      .getAll()
      .then(initialPersons => {
        setPersons(initialPersons)
    })
  }, [])

  const addPerson = (event) => {
    event.preventDefault()
    const validation = persons.map(person => person.name)

    if(!validation.includes(newName)){
      const personObject = {
        name: newName,
        number: newNumber,
      }
      personService
      .create(personObject)
      .then(returnedPerson => {
        setPersons(persons.concat(returnedPerson))
        setNewName('')
        setNewNumber('')
        setErrorMessage(`Added ${newName}`)
        handleErrorMessage()
      })
      .catch(error => {
        setErrorMessage(`${error.response.data.error}`)
        handleErrorMessage()
      })
    } else {
      if(window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)){
        const person = persons.find(person => person.name === newName)
        const id = person.id
        updateNumber(id, newNumber)
      }
    }
  }

  const updateNumber = (id, newNumber) => {
    const person = persons.find(person => person.id === id)
    const changedPerson = { ...person, number: newNumber }
  
    personService
      .update(id, changedPerson)
      .then(changedPerson => {
        setPersons(persons.map(person => person.id !== id ? person : changedPerson))
      })
      .catch(error => {
        setErrorMessage(`Information of ${newName} has been already removed from server`)
        setStyle('error')
        handleErrorMessage()
        setPersons(persons.filter(person => person.id !== id))
      })
      setNewName('')
      setNewNumber('')
    }

  const deletePerson = ( id ) => {
    const person = persons.find(person => person.id === id)
    personService
    .remove(id)
    setPersons(persons.filter(person => person.id !== id))
    setErrorMessage(`${person.name} deleted`)
    handleErrorMessage()
  }

  const handlePersonChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
      setNewNumber(event.target.value)
  }

  const handleFilter = (event) => {
      setNewFilter(event.target.value.toLowerCase())
  }

  const handleErrorMessage = () =>{
    setTimeout(() => {
        setErrorMessage(null)
        setStyle('neutral')
    }, 4000)
  }

  return (
    <div>
      <h2>Phonebook</h2>

      <Notification message={errorMessage} style={style} />

      <Filter newFilter={newFilter} handleFilter={handleFilter} />

      <h2>add a new</h2>

      <PersonForm addPerson={addPerson} newName={newName} newNumber={newNumber} 
      handlePersonChange={handlePersonChange} handleNumberChange={handleNumberChange} />

      <h2>Numbers</h2>

      <Persons persons={persons} newFilter={newFilter} deletePerson={deletePerson} />
    </div>
  )

}

export default App