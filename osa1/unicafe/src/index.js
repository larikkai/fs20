import React, {useState} from 'react';
import ReactDOM from 'react-dom';

const Header = ({title}) => <div><h1>{title}</h1></div>

const Button = ({onClick, text}) => (
    <button onClick={onClick}>{text} </button>
)

const Statistics = ({ g,n,b }) => {
    const total = g+n+b
    const average = (g-b)/total
    const positive = g/total*100

    if(total === 0){
        return (
            <p>No feedback given</p>
        )
    }

    return(
        <div>
            <table>
                <tbody>
                    < StatisticLine value={g} text={'good'} />
                    < StatisticLine value={n} text={'neutral'} />
                    < StatisticLine value={b} text={'bad'} />
                    < StatisticLine value={total} text={'total'} />
                    < StatisticLine value={average} text={'average'} />
                    < StatisticLine value={positive} text={'positive'} symbol={'%'} />
                </tbody>
            </table>
        </div>
    )
}

const StatisticLine = ({ value,text,symbol }) => {
    return (
        <tr>
            <td>{text}</td>
            <td> {value} {symbol}</td>
        </tr>
    )
}

const App = () => {

    const [good, setGood] = useState(0)
    const [neutral, setNeutral] = useState(0)
    const [bad, setBad] = useState(0)

    const handleGood = () => setGood(good + 1)
    const handleNeutral = () => setNeutral(neutral + 1)
    const handleBad = () => setBad(bad+1)


    return(
        <>
        < Header title={'give feedback'} />
        < Button onClick={handleGood} text={'good'} />
        < Button onClick={handleNeutral} text={'neutral'} />
        < Button onClick={handleBad} text={'bad'} />
        < Header title={'statistics'} />
        < Statistics g={good} n={neutral} b={bad} />
        </>
    )
}


ReactDOM.render(<App />, document.getElementById('root'));
