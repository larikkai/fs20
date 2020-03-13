import React from 'react'
import { connect } from 'react-redux'

const Notification = ({ notification }) => {

  if (!notification) {
    return null
  }

  const style = {
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    background: 'lightgrey'
  }

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default connect(
  (state) => ({ notification: state.notification })
)(Notification)