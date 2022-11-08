// import package
import twilio from 'twilio';

// import lib
import config from '../config';

export const sentSms = async ({ to, body = '' }) => {
    const client = twilio(
        config.smsGateway.TWILIO_ACCOUT_SID,
        config.smsGateway.TWILIO_AUTH_TOKEN,
    )

    try {
        await client.messages.create({
            from: config.smsGateway.TWILIO_PHONE_NUMBER,
            to,
            body
        })
        console.log("SMS Successfully")
        return {
            'smsStatus': true
        }
    }
    catch (err) {
        console.log("SMS Error", err.toString())
        return {
            'smsStatus': false
        }
    }
}

export const sentOtp = async (to) => {
    try {
        const client = twilio(
            config.smsGateway.TWILIO_ACCOUT_SID,
            config.smsGateway.TWILIO_AUTH_TOKEN,
        )

        await client.verify.services(config.smsGateway.TWILIO_SERVICE_SID).verifications.create({ to: to, channel: "sms" })
        return { smsStatus: true };
    } catch (err) {
        console.log("-----err", err)
        console.log("SMS Error", err.toString());
        return { smsStatus: false };
    }
};

export const verifyOtp = async (to, otp) => {
    try {
        const client = twilio(
            config.smsGateway.TWILIO_ACCOUT_SID,
            config.smsGateway.TWILIO_AUTH_TOKEN,
        )
        let verification_check = await client.verify.services(config.smsGateway.TWILIO_SERVICE_SID).verificationChecks.create({ to: to, code: otp });
        if (verification_check && verification_check.valid) {
            return { smsStatus: true };
        }
        return {
            smsStatus: false
        }
    } catch (err) {
        console.log("SMS Error", err.toString());
        return { smsStatus: false };
    }
};