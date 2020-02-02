import React from 'react'

const Persons = ({ persons, newFilter, deletePerson}) => {

    const filter = persons.filter(person => person.name.toLowerCase().includes(newFilter))

    const personsToShow = () => filter.map(person =>
      <div key={person.id}>
        {person.name} {person.number} 
        <Button name={person.name} id={person.id} deletePerson={deletePerson} />
      </div>)

    const Button = ({ name, id, deletePerson }) => {
      return(
        <button onClick={() => confirm({name,id,deletePerson})}>delete</button>
      )}

    const confirm = ({ name, id, deletePerson }) => {
      if(window.confirm(`Delete ${name} ?`)){
        deletePerson(id)
      }else {
        window.alert(`Nothing removed`)
      }
    }

    return(
        personsToShow()
    )
}

export default Persons