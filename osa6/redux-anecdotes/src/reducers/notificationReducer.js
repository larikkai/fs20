const notificationReducer = (state = null, action) => {
    switch (action.type) {
        case 'SET_NOTIFICATION':
            return action.notification
        case 'SET_NULL':
            return null
        default:
            return state
    }
}

export const notificationChange = notification => {
    return {
        type: 'SET_NOTIFICATION',
        notification,
    }
}

export const notificationToNull = () => {
    return {
        type: 'SET_NULL'
    }
}

export default notificationReducer