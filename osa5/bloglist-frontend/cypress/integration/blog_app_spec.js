describe('Blog app', function() {
  beforeEach(function() {
    cy.request('POST', 'http://localhost:3001/api/testing/reset')
    const user = {
      name: 'Matti Luukkainen',
      username: 'mluukkai',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user)
    const user2 = {
      name: 'Arto Hellas',
      username: 'ahellas',
      password: 'salainen'
    }
    cy.request('POST', 'http://localhost:3001/api/users/', user2)
    cy.visit('http://localhost:3000')
  })

  it('Login form is shown', function() {
    cy.contains('Log in to application')
    cy.contains('username')
    cy.contains('password')
    cy.get('#username').type('mluukkai')
    cy.get('#password').type('salainen')
    cy.get('#login-button')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('salainen')
      cy.get('#login-button').click()
      cy.contains('Matti Luukkainen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('mluukkai')
      cy.get('#password').type('test')
      cy.get('#login-button').click()
      cy.get('.error')
        .should('contain', 'wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
    })
  })

  describe('When logged in', function() {
    beforeEach(function() {
      cy.login({ username: 'mluukkai', password: 'salainen' })

    })

    it('A blog can be created', function() {
      cy.get('#new-blog').click()
      cy.get('#title').type('fs20 - e2e tests')
      cy.get('#author').type('Luukkainen')
      cy.get('#url').type('www.google.com')
      cy.get('#create-button').click()
      cy.contains('fs20 - e2e tests Luukkainen')
    })

    it('A blog can be liked', function() {
      cy.get('#new-blog').click()
      cy.get('#title').type('fs20 - e2e tests')
      cy.get('#author').type('Luukkainen')
      cy.get('#url').type('www.google.com')
      cy.get('#create-button').click()
      cy.contains('fs20 - e2e tests Luukkainen').click()
      cy.contains('fs20 - e2e tests Luukkainen')
        .get('#like-button').click()
      cy.contains('likes 1')
    })

    it('A blog can be removed by correct user', function() {
      cy.get('#new-blog').click()
      cy.get('#title').type('fs20 - e2e tests')
      cy.get('#author').type('Luukkainen')
      cy.get('#url').type('www.google.com')
      cy.get('#create-button').click()
      cy.contains('fs20 - e2e tests Luukkainen').click()
      cy.contains('fs20 - e2e tests Luukkainen')
        .get('#remove-button').click()
    })

    it('A blog cannot be removed by random user', function() {
      cy.get('#new-blog').click()
      cy.get('#title').type('fs20 - e2e tests')
      cy.get('#author').type('Luukkainen')
      cy.get('#url').type('www.google.com')
      cy.get('#create-button').click()
      cy.contains('fs20 - e2e tests Luukkainen').click()
      cy.contains('fs20 - e2e tests Luukkainen')
        .get('#remove-button').click()
    })

    it('A blog cannot be removed by random user', function() {
      cy.get('#new-blog').click()
      cy.get('#title').type('fs20 - e2e tests')
      cy.get('#author').type('Luukkainen')
      cy.get('#url').type('www.google.com')
      cy.get('#create-button').click()
      cy.get('#logout-button').click()
      cy.login({ username: 'ahellas', password: 'salainen' })
      cy.contains('fs20 - e2e tests Luukkainen').click()
      cy.contains('fs20 - e2e tests Luukkainen')
        .get('#remove-button').click()
      cy.get('.error')
        .should('contain', 'Unauthorized')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-style', 'solid')
      cy.contains('fs20 - e2e tests Luukkainen')
    })
  })
})