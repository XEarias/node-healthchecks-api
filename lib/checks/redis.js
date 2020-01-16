'use strict';

const redis = require('redis');
const Check = require('../check');

module.exports = class Redis extends Check {
    constructor(config) {
        super(config);
        this.error = new Error(`Redis connection to ${config.url} failed.`);
        this.client = config.client || redis.createClient({
            url: this.config.url,
            retry_strategy: ((options) => {
                this.error = options.error;
                return this.interval;
            }).bind(this),
        });
        this.onConnect();
    }

    onConnect() {
        this.warn('Connecting to Redis', `Attempting to connect to Redis server: '${this.config.url}'.`);
    }

    async start() {  
        this.client
            .on('connect', this.onConnect.bind(this))
            .on('reconnecting', this.onConnect.bind(this))
            .on('ready', this.ok.bind(this))
            .on('error', this.crit.bind(this))
            .on('end', this.crit.bind(this));

        return this;
    }
};