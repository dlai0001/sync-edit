describe('DB', () => {
    const knex = require('./db');

    beforeAll(async () => {
        // Reset DB state before tests.
        await knex.migrate.latest();        
        await knex.seed.run();
    });

    it('test db should be seeded', async () => {
        const users = await knex.select('*')
            .from('users')
            .where({
                name: 'David Lai',
            })
            .limit(1);

        expect(users[0].pin).toBe('0000');
    });
});