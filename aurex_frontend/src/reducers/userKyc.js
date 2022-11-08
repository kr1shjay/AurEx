// import constant
import {
    SET_USER_KYC,
    SET_ID_PROOF_KYC,
    SET_ADDRESS_PROOF_KYC
} from '../constant';

const initialState = {
    'idProof': {
        "type": "",
        "frontImage": "",
        "backImage": "",
        "selfiImage": "",
        "reason": "",
        "status": ""
    },
    "addressProof": {
        "frontImage": "",
        "reason": "",
        "type": "",
        "status": ""
    }
};

const userKyc = (state = initialState, action) => {
    switch (action.type) {
        case SET_USER_KYC:
            return {
                ...state,
                ...action.data
            };
        case SET_ID_PROOF_KYC:
            return {
                ...state,
                ...{
                    idProof: action.data.idProof
                }
            }
        case SET_ADDRESS_PROOF_KYC:
            return {
                ...state,
                ...{
                    addressProof: action.data.addressProof
                }
            }
        default:
            return state;
    }

}

export default userKyc;