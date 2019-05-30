const FilterCard = ({ children, label, handleReset }) => (
    <div className='filter-card'>
        <h6>{label}</h6>
        <a onClick={handleReset}>Reset</a>
        {children}
    </div>
)

const DateFilter = ({ handleReset, handleSelect, label, min, max }) => (
    <FilterCard label={label} handleReset={handleReset}>
        <RangePicker
            selecting='start'
            selected={min}
            handleSelect={handleSelect}
        />
        <RangePicker
            selecting='end'
            selected={max}
            handleSelect={handleSelect}
        />
    </FilterCard>
)

const Filters = props => (
    <FilterContainer>
        <DateFilter label={'Release Date'} {...props} />
        <ListFilter label={'Genre'} {...props} />
        <OptionFilter label={'Rating'} {...props} />
    </FilterContainer>
)

// compose :: (f, g) -> x -> f(g(x))
const compose = (...fns) => (...args) => fns.reduceRight((x, f) => f(x), fns.pop()(...args))
// pipe :: (f, g) -> x -> g(f(x))
const pipe = (fn0, ...fns) => (...args) => fns.reduce((x, f) => f(x), fn0(...args))
// prop :: String -> Object -> b
const prop = key => source => source[key]
// eq :: a -> b -> Boolean
const eq = a => b => a === b
// propEq :: String -> a -> Object -> Boolean
const propEq = key => val => pipe(prop(key), eq(val))

// combineValidations :: (a -> Boolean)[] -> a -> Boolean
const combineValidations = validations =>
    item => validations.every(isValid => isValid(item));

// every :: (a -> Boolean) -> a[] -> Boolean
const every = iteratee => arr => arr.every(iteratee)
// flip :: (a -> b -> c) -> b -> a -> c
const flip = f => b => a => f(a, b)

// PriceValidator :: Price -> boolean
// combineValidations :: (PriceValidator[]) -> Price -> boolean
const combineValidations = flip(pipe(applyTo, every))

// combinators
// I; identity :: a -> a
const identity = a => a
// K; always :: a -> () -> a
const always = a => () => a // aka constant()
// A; call :: (a -> b) -> a -> b
const call = f => a => f(a) // aka appyly()
// T; applyTo :: a -> (a -> b) -> b
const applyTo = a => f => f(a) // aka thrush()
// W; unnest :: (a -> b) -> a -> b
const unnest = f => a => f(a)(a) // aka duplication()
// C; flip :: (a -> b -> c) -> b -> a -> c
const flip = f => b => a => f(a, b)
// B; map :: (b -> c) -> (a -> b) -> a -> c
const map = f => g => x => f(g(x)) // aka compose()
// S; ap :: (a -> b -> c) -> (a -> b) -> a -> c
const ap = f => g => x => f(x)(g(x)) // aka substitution()
// P; on :: (b -> b -> c) -> (a -> b) -> a -> a -> c
const on = f => g => x => y => f(g(x))(g(y))
// Y; fix :: (a -> a) -> a
const fix = f => (
    g => g(g)             // g => x => f(g(g))(x)
)(
    g => f(x => g(g)(x))  // g => x => f(g(g))(x)
)
