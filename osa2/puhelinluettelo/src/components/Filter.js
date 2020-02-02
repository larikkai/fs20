import React from 'react'

const Filter = ({ newFilter, handleFilter }) => {

    return (
        <div>
            <form>
                filter shown with
                <input
                value={newFilter}
                onChange={handleFilter}
                />
            </form>
        </div>
    )
}

export default Filter