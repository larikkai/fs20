import React from 'react'

const Filter = ({ filter, handleFilter}) => {

    return (
        <div>
            <form>
                find countries
                <input value={filter}
                onChange={handleFilter}
                />
            </form>
        </div>
    )
}

export default Filter