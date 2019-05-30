const identity = a => a
const add = (a, b) => a + b // add(1, 2) === 1 + 2

describe('add(a, b)', () => {
    it('returns the sum of a and b', () => {
        expect(add(1, 2), 3)
    })
})

// impure
let b = 1
const add = a => a + b
add(1) // => 2
b = 4
add(1) // => 5

let current = 0
const increment = a => current += a
increment(1) // => 1
increment(1) // => 2
current = 'A'
increment(1) // => 'A1'

const fetchStuff = query => db.get(query)

const purefetch = db => query => () => db.get(query)

const FilterCard = ({ children, label, handleReset }) => (
    <div className='filter-card'>
        <h6>{label}</h6>
        <a onClick={handleReset}>Reset</a>
        {children}
    </div>
)


