import React, { useState, useEffect } from 'react';
import axios from 'axios'
import Filter from './Filter'
import Countries from './Countries'

const App = () => {

  const [countries, setCountries] = useState([])
  const [filter, setFilter] = useState('')

  const handleFilter = (event) => {
    setFilter(event.target.value.toLowerCase())
  }

  useEffect(() => {
    console.log('effect')
    axios
    .get('https://restcountries.eu/rest/v2/all')
    .then(response => {
      console.log('promise fulfilled')
      setCountries(response.data)
    })
  }, [])

  return (
    <div>
      <Filter filter={filter} handleFilter={handleFilter} />
      <Countries countries={countries} filter={filter} setFilter={setFilter} />
    </div>
  )
}

export default App;
