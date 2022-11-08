// import lib
import isEmpty from '../../lib/isEmpty';

export const validation = value => {
    let errors = {};
    let imageFormat = /\.(jpg|JPG|jpeg|JPEG|png|PNG|pdf|PDF)$/;

    if (isEmpty(value.type)) {
        errors.type = "REQUIRED";
    }
    if (isEmpty(value.proofNumber)) {
        errors.proofNumber = "REQUIRED";
    }

    if (value.frontImage && value.frontImage.size) {
        if (value.frontImage.size > 10000000) {  // 10 MB
            errors.frontImage = "TOO_LARGE"
        } else if (!imageFormat.test(value.frontImage.name)) {
            errors.frontImage = "INVALID_IMAGE"
        }
    } else {
        errors.frontImage = "REQUIRED";
    }

    if (!isEmpty(value.type) && value.type != 'passport') {
        if (value.backImage && value.backImage.size) {
            if (value.backImage.size > 10000000) {   // 10 MB
                errors.backImage = "TOO_LARGE"
            } else if (!imageFormat.test(value.backImage.name)) {
                errors.backImage = "INVALID_IMAGE"
            }
        } else {
            errors.backImage = "REQUIRED";
        }
    }

    if (value.selfiImage && value.selfiImage.size) {
        if (value.selfiImage.size > 12000000) {  // 12 MB
            errors.selfiImage = "TOO_LARGE"
        } else if (!imageFormat.test(value.selfiImage.name)) {
            errors.selfiImage = "INVALID_IMAGE"
        }
    } else {
        errors.selfiImage = "REQUIRED";
    }

    if (value.panImage && value.panImage.size) {
        if (value.panImage.size > 12000000) {  // 12 MB
            errors.panImage = "TOO_LARGE"
        } else if (!imageFormat.test(value.panImage.name)) {
            errors.panImage = "INVALID_IMAGE"
        }
    } else {
        errors.panImage = "REQUIRED";
    }

    return errors;
}

export default validation;