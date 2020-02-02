import React from 'react'
import Country from './Country'

const Countries = ({ countries, filter, setFilter }) => {
    const result = countries.filter(country => country.name.toLowerCase().includes(filter))

    const countriesToShow = () => 
        result.map(country =>
        <div key={country.name}> {country.name} 
        <button onClick={() => setCountry(country.name.toLowerCase())}>show</button>
        </div>
        )
    
    const setCountry = ( name ) => setFilter(name)
    const size = countries.filter(country => country.name.toLowerCase()
    .includes(filter)).reduce((acc, score) => acc+1, 0)
    
    if(size === 1){
        return(
            <div>
                <Country country={result[0]} />
            </div>
        )
    }else if(size <= 10 && size > 1){
        return (
            countriesToShow()
        )
    }else {
        return(
            <div>
                Too many matches, specify another filter
            </div>
        )
    }
}

export default Countries