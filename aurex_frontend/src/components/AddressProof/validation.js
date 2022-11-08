// import lib
import isEmpty from '../../lib/isEmpty';

export const validation = value => {
    let errors = {};
    let imageFormat = /\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF)$/;
    if (value.frontImage && value.frontImage.size) {
        if (value.frontImage.size > 10000000) {   // 10 MB
            errors.frontImage = "TOO_LARGE"
        } else if (!imageFormat.test(value.frontImage.name)) {
            errors.frontImage = "INVALID_IMAGE"
        }
    } else {
        errors.frontImage = "REQUIRED";
    }


    return errors;
}

export default validation;