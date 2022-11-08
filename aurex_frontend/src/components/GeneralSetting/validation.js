// import lib
import isEmpty from '../../lib/isEmpty';

const validation = value => {
    let errors = {};
    // if (isEmpty(value.languageId)) {
    //     errors.languageId = "REQUIRED"
    // }

    // if (isEmpty(value.theme)) {
    //     errors.theme = "REQUIRED"
    // }

    if (isEmpty(value.currencySymbol)) {
        errors.currencySymbol = "REQUIRED"
    }

    // if (value.timeZone && (isEmpty(value.timeZone.name) || isEmpty(value.timeZone.GMT))) {
    //     errors.timeZone = "REQUIRED"
    // } else if (!value.timeZone) {
    //     errors.timeZone = "REQUIRED"
    // }

    if (value.afterLogin && (isEmpty(value.afterLogin.page) || isEmpty(value.afterLogin.url))) {
        errors.afterLogin = "REQUIRED"
    } else if (!value.afterLogin) {
        errors.afterLogin = "REQUIRED"
    }

    return errors;
}

export default validation;