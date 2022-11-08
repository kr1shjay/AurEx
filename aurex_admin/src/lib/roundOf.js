// import lib
import isEmpty from './isEmpty';

export const toFixed = (item, type = 2) => {
    try {
        if (!isEmpty(item) && !isNaN(item)) {
            item = parseFloat(item)
            return item.toFixed(type)
        }
        return ''
    } catch (err) {
        return ''
    }
}

export const currencyFormat = (item) => {
    try {
        if (!isEmpty(item) && !isNaN(item)) {
            item = item.toString();
            let splitValue = item.split('.')
            return splitValue[1] ? `${splitValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")}.${splitValue[1]}` : splitValue[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",")
        }
        return ''
    } catch (err) {
        return ''
    }
}