import React from 'react'
import Weather from './Weather'

const Country = ({ country }) => {
    return (
        <div>
          <h2>{country.name}</h2>
              <p>
              capital {country.capital} <br />
              population {country.population} <br />
              </p>
          <div>
              <h3>languages</h3>
              <ul>
              {country.languages.map(lang => (
                <li 
                  key={lang.name}>
                  {lang.name}
                </li>
              ))}
              </ul>
          </div>
          <img src={country.flag} alt='flag' width={100} height={100}></img>
          <Weather capital={country.capital} />
        </div>
    )
}

export default Country