// import constant
import {
    SET_USER_FIRST_CURRENCY,
    SET_USER_SECOND_CURRENCY,
    UPDATE_SPOT_ASSET
} from '../constant';

const initialValue = {
    firstCurrency: {},
    secondCurrency: {}
}
const tradeAsset = (state = initialValue, action) => {
    switch (action.type) {
        case SET_USER_FIRST_CURRENCY:
            return {
                ...state,
                ...{
                    'firstCurrency': action.data
                }
            };
        case SET_USER_SECOND_CURRENCY:
            return {
                ...state,
                ...{
                    'secondCurrency': action.data
                }
            };
        case UPDATE_SPOT_ASSET:
            if (state && state.firstCurrency && state.secondCurrency) { 
                if (state.firstCurrency.currencyId == action.data.currencyId) {
                    return {
                        ...state,
                        ...{
                            'firstCurrency': action.data
                        }
                    };
                } else if (state.secondCurrency.currencyId == action.data.currencyId) {
                    return {
                        ...state,
                        ...{
                            'secondCurrency': action.data
                        }
                    };
                }
            }

        default:
            return state;
    }
}

export default tradeAsset;