const knex = require('../db');

const AUDIT_TABLE = 'audit_log';

class AuditService {
    constructor() {
        this.knex = knex;
    }

    /**
     * Log an action to the access log.
     * @param {Integer|Object} userOrUserId 
     * @param {String} action 
     * @param {String} data - additional context data we want to add.
     */
    async log(userOrUserId, action, data = '') {
        const userId = userOrUserId.id || userOrUserId;

        const auditEntry = {
            userId,
            action,
            data,
        };
        await this.knex.insert(auditEntry).into(AUDIT_TABLE);
    }
}


module.exports = new AuditService();