export const transactionStatus = (status) => {
    status = parseInt(status);
    switch (status) {
        case 1: return 'New';
        case 2: return 'Pending';
        case 3: return 'Completed';
        case 4: return 'Cancel';
        case 5: return 'Rejected';
        default: return 'New';
    }
}

export const paymentStatus = (status) => {
    status = parseInt(status);
    switch (status) {
        case 1: return 'Deposit';
        case 2: return 'Withdraw';
        default: return '';
    }
}

export const idProofName = (type, status) => {
    let typeValue = type;
    if (status == 1) {
        typeValue = ''
    }
    switch (typeValue) {
        case 1: return "Passport";
        case 2: return "Driving Licence";
        case 3: return "National Security Card";
        default: return ""
    }
}

export const addressProofName = (type, status) => {
    let typeValue = type;
    if (status == 1) {
        typeValue = ''
    }
    switch (typeValue) {
        case 1: return "Bank Passbook";
        case 2: return "National Card";
        case 3: return "Passport";
        default: return ""
    }
}
