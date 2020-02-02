import React, { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital, url }) => {

    const [location, setLocation] = useState([])
    const [current, setCurrent] = useState([])

    const api_key = process.env.REACT_APP_API_KEY

    useEffect (() => {
        console.log('effect')
            axios
            .get("http://api.weatherstack.com/current?access_key="+api_key+"&query="+capital)
            .then(response => {
            console.log('weather loaded')
            setLocation(response.data.location)
            setCurrent(response.data.current)
          })
        }, [])
    
    return (
        <div>
            <h2>Weather in {location.name} </h2>
            <b>temperature: </b> {current.temperature} Celsius <br />
            <img src={current.weather_icons} alt="weather" /> <br />
            <b> wind:</b> {current.wind_speed} kph direction {current.wind_dir}
        </div>
    )
}

export default Weather