const MDN_JS_URL = 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'
const RTFM = () => MDN_JS_URL

RTFM() // => 'https://developer.mozilla.org/en-US/docs/Web/JavaScript'

Array.prototype.forEach = function forEach (fun) {
    for (let idx = 0; idx < this.length; idx++)
        fun(arr[idx], idx, this)
}

Array.prototype.map = function map (fun) {
    const mapped = []
    
    this.forEach((item, idx, array) =>
        mapped.push(fun(item, idx, array))
    )

    return mapped
}

const squareValues = arr =>
    arr.map(val => val * val)

// map :: (a -> b) -> a[] -> b[]
const map = iteratee => array => array.map(iteratee)
// square :: Number -> Number
const square = val => val * val
// squareValues :: Number[] -> Number[]
const squareValues = map(square)

// get :: String -> Object -> () -> a
const get = key => source => source[key]
// set :: String -> Object -> a -> Object
const set = key => (target, val) => (target[key] = val, target)

const user = {
    id: 27,
    age: 31,
    name: 'forrest',
}

// getName :: Object -> () -> String
const getName = get('name')
// setName :: Object -> a -> Object
const setName = set('name')

// getUserName :: () -> a
const getUserName = user => () => getName(user)
// setUserName :: a -> User
const setUserName = user => name => setName(user, name)

const User = user => ({
    id: user.id,
    getName: getUserName(user),
    setName: setUserName(user),
})

const enhancedUsers = users.map(User)

const [user] = enhancedUsers
user.getName() // => 'forrest
user.setName('Forrest Akin') // => { name: 'Forrest Akin' }
user.getName() // => 'Forrest Akin'
