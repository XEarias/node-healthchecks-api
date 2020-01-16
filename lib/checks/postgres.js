const { Check } = require('healthchecks-api')

module.exports = class Postgres extends Check {
    constructor(config) {
        super(config)
        const { client } = config
        this.client = client
        this.error = new Error(`Postgres connection to ${config.url} failed.`)
    }

    async start () {
        return await new Promise((async (resolve) => {
            try {
                await this.client.query('SELECT 1')
                this.ok()
            } catch (e) {
                this.error = e
                this.crit()
            }

            setTimeout(this.start.bind(this), this.interval)
            resolve(this)
        }).bind(this))
    }
};