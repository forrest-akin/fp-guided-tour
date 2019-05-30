// hasDisabledPricesheet :: (String, Product) -> Boolean
const hasDisabledPricesheet = (id, { pricesheets = [] }) => {
    for (const pricesheet of pricesheets) {
        if (pricesheet.id === id) {
            return pricesheet.disabled
        }
    }
}

// compose :: (f, g) -> x -> f(g(x))
const compose = (...fns) => (...args) => fns.reduceRight(applyTo, fns.pop()(...args))
// pipe :: (f, g) -> x -> g(f(x))
const pipe = (fn0, ...fns) => (...args) => fns.reduce(applyTo, fn0(...args))
// prop :: String -> Object -> a
const prop = key => source => source[key]
// eq :: a -> b -> Boolean
const eq = a => b => a === b
// propEq :: String -> a -> Object -> Boolean
const propEq = key => val => pipe(prop(key), eq(val))
// find :: (a -> Boolean) -> a?
const find = iteratee => arr => arr.find(iteratee)
// getPricesheets :: Object -> Pricesheet[]
const getPricesheets = prop('pricesheets')
// idEq :: String -> Object -> Boolean
const idEq = propEq('id')
// findById :: String -> Object[] -> Boolean
const findById = pipe(idEq, find)
// getDisabled :: Object -> Boolean
const getDisabled = prop('disabled')

// hasDisabledPricesheet :: String -> Product -> Boolean
const hasDisabledPricesheet = id => pipe(
    getPricesheets,
    findById(id),
    getDisabled
);

const reducePrices = product =>
    prices => prices.reduce(reducePrice, product)

const reducePrice = (update, price) =>
    isInvalid(update, price)
    ? update
    : reduceValidPrice(update, price)

const reduceValidPrice = (update, price) =>
    isPricesheetPrice(price)
    ? reducePricesheetPrice(update, price)
    : reduceProductPrice(update, price)

const reducePricesheetPrice = (update, price) => {
    const { cache, price_templates, pricesheets } = update

    ensurePriceTemplate(cache, price_templates, price)

    if (!isDateBasedPrice(price)) {
        upsertTemplatePrice(cache, price_templates, price)
    }

    savePricesheetPrice(cache, pricesheets, price)

    return update
}

const reduceProductPrice = (update, price) => {
    const { cache, prices } = update

    if (!isDateBasedPrice(price)) {
        upsertSizePrice(cache, price)
    }

    savePricesPrice(prices, price)

    return update
}

// composeReducers :: ((b, a) -> b)[] -> (b, a) -> b
const composeReducers = (...reducers) =>
    (acc, a) => reducers.reduce((b, f) => f(b, a), acc)
