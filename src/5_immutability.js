const setName = (user, name) => {
    user.name = name
}

users.forEach(user => setName(user, `${user.name}@js.la`))

const immuSetName = (user, name) => ({
    ...user,
    name
})

const newUsers = map(user => immuSetName(user, `${user.name}, the Pure`))

// set :: String -> a -> Object -> Object
const set = key => val => target => ({ ...target, [key]: val })
const setName = set('name')

const defaultActionHandler = (state, update) => ({ ...state, ...update })

const map = mapper => array =>
    (function recurse (idx, mapped) {
        return idx < array.length
            ? recurse(idx + 1, [...mapped, mapper(array[idx])])
            : mapped
    })(0, [])
