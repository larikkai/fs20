import React from 'react'

const Header = ({ title }) => <div><h1>{title}</h1></div>

const Part = ({name, e}) => <p>{name} {e}</p>

const Total = ({ parts }) => {
    const result = parts.reduce(( sum, part ) => sum + part.exercises, 0)
    return (
        <b>total of {result} exercises</b>
    )
}

const Content = ({ parts }) => parts.map(part => 
    <Part 
    key={part.id}
    name={part.name}
    e={part.exercises} />
    )

const Courses = ({ course }) => {
    return (
      <div>
        <Header title={course.name} />
        <Content parts={course.parts} />
        <Total parts={course.parts} />
      </div>
    )
}

const Course = ({ courses }) => courses.map(course =>
    <Courses key={course.id}
    course={course} />
    )

export default Course
