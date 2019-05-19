/**
 * Fake SMS that logs to server console.  This would be replaced with
 * some 3rd party provider.
 */
module.exports = (phoneNumber, text) => {
    console.log(`Sending ${phoneNumber}: ${text}`);
}