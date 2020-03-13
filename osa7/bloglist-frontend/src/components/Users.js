import React from 'react'
import { useSelector } from 'react-redux'

const Users = () => {
  const blogs = useSelector(state => state.blogs)
  const users = blogs.map(blog => blog.user)
  console.log(users)
  const rows = () => {
    return (
      <div>
        {users.map(user =>
          <tr key={user.id}>
            <td>{user.name}</td>
          </tr>
        )}
      </div>
    )
  }

  return (
    <div>
      <h2>Users</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>blogs.created</th>
          </tr>
          {rows()}
        </tbody>
      </table>
    </div>
  )
}

export default Users