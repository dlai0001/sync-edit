
let lastCall = null;  // Track last sent SMS for testing purposes

/**
 * Get last sent SMS.  Used for unit testing.
 */
const getLastSms = () => {
    return lastCall;
}

/**
 * Fake SMS that logs to server console.  This would be replaced with
 * some 3rd party provider.
 * @param {String} phoneNumber
 * @param {String} text
 */
const sendSms = (phoneNumber, text) => {
    console.log(`Sending ${phoneNumber}: ${text}`);
    lastCall = {
        phoneNumber,
        text,
    }
}

module.exports = {
    sendSms,
    getLastSms,
};