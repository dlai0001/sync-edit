const knex = require('../db');

const AUDIT_TABLE = 'audit_log';

class AuditService {
    constructor() {
        this.knex = knex;
    }

    async log(user, action, data = '') {
        const auditEntry = {
            userId: user.id,
            action,
            data,
        };
        await this.knex.insert(auditEntry).into(AUDIT_TABLE);
    }
}


module.exports = new AuditService();