const getProductPrices = product => product.sizes.reduce((prices, size) => {
    const sizePriceMap = size.pricing.reduce((priceMap, item) => {
        priceMap[item.currency_code] = item
        return priceMap
    }, {})

    const sizePrices = product.pricing.map(({ currency_code, wholesale, retail }) => ({
        currency_code,
        wholesale: sizePriceMap[currency_code].wholesale || wholesale,
        retail: sizePriceMap[currency_code].retail || retail,
    }))

    return sizePrices.forEach(({
        currency_code, wholesale, retail,
    }) => prices.push(
        {
            brand_id: product.brandId,
            product_id: product.id,
            size_id: size.id,
            currency_code,
            type: 'wholesale',
            price: wholesale,
        },
        {
            brand_id: product.brandId,
            product_id: product.id,
            size_id: size.id,
            currency_code,
            type: 'retail',
            price: retail,
        }
    ))
}, [])

const getSizes = prop('sizes')
const ap = f => g => x => f(x)(g(x))
// concat :: (a[], a[]) -> a[]
const concat = (a, b) => [...a, ...b]
// flatMap :: (a[] -> b[]) -> b[]
const flatMap = iteratee => array =>
    array.reduce((flattened, item) => {
        const mapped = Array.isArray(item) ? item.map(iteratee) : [iteratee(item)]
        flattened.push(...mapped)
        return flattened
    }, [])

// getProductPrices :: Product -> Price[]
const getProductPrices = ap(pipe(getSizePrices, flatMap), getSizes)

// getSizePrices :: Product -> Size -> Price[]
const getSizePrices = product => size =>
    flatMap(mapPrice(product, size),
        map(ensurePricePerCurrency(size.prices), product.pricing)
    )

const ensurePricePerCurrency = (sizePrices) => {
    // if no prices for size, use default prices
    const sizePriceMap = keyByCurrency(sizePrices);

    return ({ currency_code, wholesale, retail }) => ({
        currency_code,
        wholesale: defaultTo(getWholesale(sizePriceMap[currency_code]), wholesale),
        retail: defaultTo(getRetail(sizePriceMap[currency_code]), retail),
    });
}

// defaultTo :: (a, b) -> a | b
const defaultTo = (a, b) => a === undefined ? b : a

// keyBy :: String -> a[] -> Object<a>
const keyBy = key => array =>
    array.reduce((keyed, item) => (keyed[item[key]] = item, keyed), {})

// keyByCurrency :: a[] -> Object
const keyByCurrency = keyBy('currency_code')
// getWholesale :: Object -> Number
const getWholesale = prop('wholesale')
// getRetail :: Object -> Number
const getRetail = prop('retail')

// mapPrice :: (Product, Size) -> SizePrice -> Price[]
const mapPrice = (product, size) => ({ currency_code, wholesale, retail }) => ([
    WholesalePrice(product.brand_id, product.id, size.id, currency_code, wholesale),
    RetailPrice(product.brand_id, product.id, size.id, currency_code, retail)
])

// WholesalePrice :: (String, String, String, String, Number) -> Price
const WholesalePrice = (brand_id, product_id, size_id, currency_code, price) =>
    Price(brand_id, product_id, size_id, currency_code, 'wholesale', price)

// RetailPrice :: (String, String, String, String, Number) -> Price
const RetailPrice = (brand_id, product_id, size_id, currency_code, price) =>
    Price(brand_id, product_id, size_id, currency_code, 'retail', price)

// Price :: (String, String, String, String, String, Number) -> Price
const Price = (brand_id, product_id, size_id, currency_code, type, price) => ({
    brand_id, product_id, size_id, currency_code, type, price,
})

const getUniqueItems = items => {
    const visited = {}
    const unique = []
    
    for (let i = 0; i < items.length; i++) {
        const item = items[i]

        if (!visited[item.id]) {
            visited[item.id] = true
            unique.push(item)
        }
    }

    return unique
}

const filterUnique = (key = identity, visited = {}) =>
    a => !has(visited, key(a)) && set(visited, key(a), true)

const getUniqueItemsByProp = pipe(prop, filterUnique, filter)
const getUniqueItemsByCurrency = getUniqueItemsByProp('currency_code')
const uniqueItemsByCurrency = getUniqueItemsByCurrency(items)

const reduceUnique = (reducer, key = identity, visited = {}) =>
    (b, a) => has(visited, key(a))
        ? b
        : set(visited, key(a), true) && reducer(b, a)

const pickTo = (keys = []) => (source = {}) =>
    keys.reduce((target, key) => {
        const [ from, to ] = Array.isArray(key)
            ? key
            : [key, key]

        return has(source, from)
            ? set(target, to, source[from])
            : target
    }, {});

// mapReducer :: (a -> b) -> ((c, b) -> c) -> (c, a) -> c
const mapReducer = mapper => reducer =>
    (reduced, item) => reducer(reduced, mapper(item))

// ensureMappingArray :: String | String[] -> String[]
const ensureMappingArray = key => Array.isArray(key) ? key : [key, key]

// setIfInSource :: Object -> (Object, String[]) -> Object
const setIfInSource = source => (target, [ from, to ]) =>
    source.hasOwnProperty(from)
        ? _.set(target, to, source[from])
        : target

// objectReducer :: ((b, a) -> b) -> a[] -> b
const objectReducer = reducer => reduce(reducer, {})

// createPicker :: Object -> (c, a) -> c
const createPicker = pipe(setIfInSource, mapReducer(ensureMappingArray))

// pickTo :: (String[]) -> Object -> Object
const pickTo = flip(pipe(createPicker, objectReducer))
