import React from 'react'
import ReactDOM from 'react-dom'

const Header = (props) => {
    return (
        <div>
            <h1>{props.title}</h1>
        </div>
    )
}

const Part = (props) => {
    return (
        <div>
            <p>{props.name} {props.e}</p>
        </div>
    )
}

const Total = (props) => {
    return (
        <div>
            <p>Number of exercises {props.p[0].exercises + props.p[1].exercises + props.p[2].exercises}</p>
        </div>
    )
}

const Content = (props) => {
    return(
        <div>
            < Part name={props.p[0].name} e={props.p[0].exercises} />
            < Part name={props.p[1].name} e={props.p[1].exercises} />
            < Part name={props.p[2].name} e={props.p[2].exercises} />
        </div>
    )
}

const App = () => {
    const course = {
        name: 'Half Stack application development',
        parts: [
          {
            name: 'Fundamentals of React',
            exercises: 10
          },
          {
            name: 'Using props to pass data',
            exercises: 7
          },
          {
            name: 'State of a component',
            exercises: 14
          }
        ]
      }

    return (
        <>
        < Header title={course.name} />
        < Content p={course.parts} />
        < Total p={course.parts} />
        </>
    )
}

ReactDOM.render(<App />, document.getElementById('root'))
