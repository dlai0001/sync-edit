const PNF = require('google-libphonenumber').PhoneNumberFormat;
const phoneUtil = require('google-libphonenumber').PhoneNumberUtil.getInstance();

const DEFAULT_REGION = 'US';

/**
 * Checks if phone number could possibly be a valid phone number.
 * @param {String} phoneNumber
 */
module.exports.validatePhoneNumber = phoneNumber => {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, DEFAULT_REGION);
    return phoneUtil.isPossibleNumber(parsedNumber);
};

/**
 * Formats phone number into E164
 * @param {String} phoneNumber
 */
module.exports.formatPhoneNumber = (phoneNumber) => {
    const parsedNumber = phoneUtil.parseAndKeepRawInput(phoneNumber, DEFAULT_REGION);
    return phoneUtil.format(parsedNumber, PNF.E164);
}