// propEq :: String -> a -> Object -> Boolean
const propEq = key => val => source => source[key] === val

// currencyCodeEq :: String -> Price -> Boolean
const currencyCodeEq: IStringPriceValidator = propEq('currency_code')
// typeEq :: String -> Price -> Boolean
const typeEq: IStringPriceValidator = propEq('type')

// isActivePrice :: Date -> Price -> Boolean
const isActivePrice: IDatePriceValidator = effectiveDate => ({ start_date, end_date }) =>
    start_date <= effectiveDate 
    && effectiveDate <= end_date

// getPriceValidations :: (String, String, Date) -> (Price -> Boolean)[]
const getPriceValidations: IGetValidations = (currencyCode, type, effectiveDate) => [
    currencyCodeEq(currencyCode),
    typeEq(type),
    isActivePrice(effectiveDate),
];

const combineValidations: ICombineValidations = validations =>
    price => validations.every(isValid => isValid(price))

type IGetValidations = (currencyCode: string, type: string, effectiveDate: Date) => IPriceValidator[]
type ICombineValidations = (validations: IPriceValidator[]) => IPriceValidator
type IStringPriceValidator = (s: string) => IPriceValidator
type IDatePriceValidator = (d: Date) => IPriceValidator
type IPriceValidator = (price: IPrice) => boolean
interface IPrice {
    id: string;
    sku_id: string;
    currency_code: string;
    type: string;
    price: number;
    start_date: Date;
    end_date: Date;
}
