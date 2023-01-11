// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};
    var letters = /^[A-Za-z]+$/;
    var letters2 = /^[A-Za-z ]+$/;
    var numbers = /^[0-9]+$/;
    var imageFormat = /\.(jpg|JPG|jpeg|JPEG|png|PNG)$/;

    if (isEmpty(value.firstName)) {
        errors.firstName = "REQUIRED"
    } else if (!letters.test(value.firstName)) {
        errors.firstName = "FIRST_NAME_ALPHABET"
    }
    if (isEmpty(value.lastName)) {
        errors.lastName = "REQUIRED"
    } else if (!letters2.test(value.lastName)) {
        errors.lastName = "LAST_NAME_ALPHABET"
    }
    if (isEmpty(value.blockNo)) {
        errors.blockNo = "REQUIRED"
    } 
    // else if (!letters.test(value.blockNo)) {
    //     errors.blockNo = "BLOCKNO_NAME_ALPHABET"
    // }
    if (isEmpty(value.address)) {
        errors.address = "REQUIRED"
    }
    if (isEmpty(value.country)) {
        errors.country = "REQUIRED"
    }
    if (isEmpty(value.state)) {
        errors.state = "REQUIRED"
    } else if (!letters.test(value.state)) {
        errors.state = "STATE_NAME_ALPHABET"
    }
    if (isEmpty(value.city)) {
        errors.city = "REQUIRED"
    } else if (!letters.test(value.city)) {
        errors.city = "CITY_NAME_ALPHABET"
    }
    if (isEmpty(value.postalCode)) {
        errors.postalCode = "REQUIRED"
    } else if (!numbers.test(value.postalCode)) {
        errors.postalCode = "POSTAL_CODE_MUST_NUMBER"
    }

    // if (isEmpty(value.profileImage.name)) {
    //     errors.profileImage = "REQUIRED"
    // } else if (!imageFormat.test(value.profileImage.name)) {
    //     errors.profileImage = "INVALID_IMAGE"
    // }


    return errors;
}

export default validation;