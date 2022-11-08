export const currencySymbol = (currency) => {
    try {
        currency = currency.toUpperCase()
        if (currency == 'USD' || currency == 'USDT') return "$";
        if (currency == 'EUR') return "€";
        if (currency == 'INR') return "₹";
        return currency
    } catch (err) {
        return ''
    }
}