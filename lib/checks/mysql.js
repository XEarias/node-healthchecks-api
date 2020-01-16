'use strict';

const mysql = require('mysql');
const Check = require('../check');

module.exports = class Mysql extends Check {
    constructor(config) {
        super(config);
        this.error = new Error(`MySQL connection to ${config.url} failed.`);
        this.client = config.client || mysql.createConnection({
            host : config.url,
            user : config.user,
            password : config.password,
            database : config.database,
        });
    }

    async start () {
        return await new Promise((resolve => {
            connection.ping(err => {
                if (err) {
                    this.error = err;
                    this.crit();
                } else {
                    this.ok();
                }
                connection.end();
                setTimeout(this.start.bind(this), this.interval);
                resolve(this);
            });
        }).bind(this));
    }
};