// import package
import mongoose from 'mongoose';

// import helpers
import isEmpty from '../../lib/isEmpty';

/**
 * User Login
 * METHOD : POST
 * URL : /api/new/login 
 * BODY : email, phoneCode, phoneNo, formType, password, isTerms, loginHistory
*/
export const loginValidate = (req, res, next) => {
    let errors = {}, reqBody = req.body;
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,6}))$/;
    console.log("🚀 ~ file: user.validation.js ~ line 83 ~ loginValidate ~ reqBody", reqBody)

    if (isEmpty(reqBody.formType)) {
        errors.formType = "Form Type field is required";
    } else if (!['email', 'mobile'].includes(reqBody.formType)) {
        errors.formType = "Form Type field is required";
    }

    if (reqBody.formType == 'email') {
        if (isEmpty(reqBody.email)) {
            errors.email = "EMAIL_REQUIRED";
        } else if (!(emailRegex.test(reqBody.email))) {
            errors.email = "EMAIL_INVALID";
        }
    }

    if (reqBody.formType == 'mobile') {
        if (isEmpty(reqBody.phoneCode)) {
            errors.phoneCode = "Required"
        }

        if (isEmpty(reqBody.phoneNo)) {
            errors.phoneNo = "Required"
        }
    }

    if (isEmpty(reqBody.password)) {
        errors.password = "PASSWORD_REQUIRED";
    }

    // if (!(reqBody.isTerms == true)) {
    //     errors.isTerms = "TERMS_REQUIRED";
    // }

    if (!isEmpty(errors)) {
        return res.statusCode(400).json({ "errors": errors })
    }

    return next();
}