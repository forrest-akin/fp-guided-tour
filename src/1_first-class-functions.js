const logValues = arr =>
    arr.forEach(val => console.log(val))

Array.prototype.forEach = function forEach (fun) {
    for (let idx = 0; idx < this.length; idx++)
        fun(arr[idx], idx, this)
}

const squareValues = arr =>
    arr.map(val => val * val)

Array.prototype.map = function map (fun) {
    const mapped = []
    
    for (let idx = 0; idx < this.length; idx++)
        mapped.push(fun(arr[idx], idx, this))

    return mapped
}

const oddValues = arr =>
    arr.filter(val => val % 2)

Array.prototype.filter = function filter (fun) {
    const filtered = []

    for (let idx = 0; idx < this.length; idx++) {
        if (fun(arr[idx], idx, this)) filtered.push(arr[idx])
    }

    return filtered    
}

const sumValues = arr =>
    arr.reduce((sum, val) => sum + val, 0)

Array.prototype.reduce = function reduce (fun, init) {
    let reduced = init === undefined ? this[0] : init

    for (let idx = init === undefined ? 1 : 0; idx < this.length; idx++) {
        reduced = fun(reduced, arr[idx], idx, this)
    }

    return reduced
}
