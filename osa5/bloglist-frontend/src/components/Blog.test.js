import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, fireEvent } from '@testing-library/react'
//import { prettyDOM } from '@testing-library/dom'
import Blog from './Blog'

test('renders content', () => {
  const blog = {
    title: 'Testing in osa5 C',
    author: 'Student',
    url: 'www.google.com',
    likes: 0,
    user: {
      name: 'Matti Luukkainen'
    }
  }

  const component = render(
    <Blog blog={blog} />
  )
  // Testien debug
  // Tulosta consoliin componentin generoima HTML
  //component.debug()

  // Elementtin sisältä tulostus
  //const button = component.container.querySelector('button')
  //console.log(prettyDOM(button))

  // Hae tiettyä tekstiä komponentin renderöimästä HTML:stä
  expect(component.container).toHaveTextContent(
    'Testing in osa5 C Student'
  )

  // Palauttaa tietyn elementin
  const element = component.getAllByText(
    'Testing in osa5 C Student'
  )
  expect(element).toBeDefined()

  /*const div = component.container.querySelector('.blog')
  expect(div).toHaveTextContent(
    'Testing in osa5 C'
  )*/
})

test('render title, author, but not likes or url', () => {
  const blog = {
    title: 'Testing in osa5 C',
    author: 'Student',
    url: 'wwww.google.com',
    likes: 0,
    user: {
      name: 'Matti Luukkainen'
    }
  }

  const component = render(
    <Blog blog={blog} />
  )

  expect(component.container).toHaveTextContent(
    'Testing in osa5 C Student'
  )

  const element = component.getAllByText(
    'Testing in osa5 C Student'
  )
  expect(element).toBeDefined()

  const likeElement = component.getByText('like')

  expect(likeElement).not.toBeVisible()

  const urlElement = component.getByText('wwww.google.com')

  expect(urlElement).not.toBeVisible()
})

test('show url and likes when pressed', () => {
  const blog = {
    title: 'Testing in osa5 C',
    author: 'Student',
    likes: 0,
    url: 'www.google.com',
    user: {
      name: 'Matti Luukkainen'
    }
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} hideWhenVisible={mockHandler}/>
  )

  const button = component.container.querySelector('button')
  fireEvent.click(button)

  const urlElement = component.getByText('www.google.com')
  expect(urlElement).toBeDefined()

  const likeElement = component.getByText('like')
  expect(likeElement).toBeDefined()

  const likeElementCount = component.getByText('0')
  expect(likeElementCount).toBeDefined()
})

test('clicking the button twice calls event handler twice', async () => {
  const blog = {
    title: 'Testing in osa5 C',
    author: 'Student',
    url: 'www.google.com',
    likes: 0,
    user: {
      name: 'Matti Luukkainen'
    }
  }

  const mockHandler = jest.fn()

  const component = render(
    <Blog blog={blog} handleLike={mockHandler} />
  )

  const button = component.getByText('like')
  fireEvent.click(button)
  fireEvent.click(button)

  expect(mockHandler.mock.calls.length).toBe(2)
})