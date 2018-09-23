'use strict';

const healthCheck = require('healthchecks-api');

const express = require('express');
const packageJson = require('./package.json');
const app = express();
const morgan = require('morgan');
const fs = require('fs');
const util = require('util');
var os = require('os');

const PORT = process.env.PORT || 3000;

const ARRAY = [];
let STRING = 'asdfasdgssdfgwgwdt24562456fdgsdfgdfga236234asga';
let counter = 0;

let cpuUsage = process.cpuUsage();

(async () => {
    app.use(morgan('tiny'));
    if (process.env.HEALTH) {
        await healthCheck(app);
    }

    app.get('/status', (req, res, next) => res.json({
        message: 'OK',
    }));

    app.get('/make-leak', async (req, res, next) => {
        counter = 0;
        cpuUsage = process.cpuUsage(cpuUsage);

        const grow = () => {
            counter++;
            STRING += 'sdsdfgsfdhdghsdg21342341234';
            ARRAY.push(Array.from(STRING));
            if (counter < 1000) {
                setTimeout(grow, 10);
            }
        };

        grow();

        // const osRelease = await util.promisify(fs.readFile)('/etc/os-release');
        res.json({
            message: 'HEAVY',
            cpus: os.cpus(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            memoryUsage: process.memoryUsage(),
            cpuUsage,
        });
    });

    app.get('/heavy', async (req, res, next) => {
        cpuUsage = process.cpuUsage(cpuUsage);
        // const osRelease = await util.promisify(fs.readFile)('/etc/os-release');
        res.json({
            message: 'HEAVY',
            cpus: os.cpus(),
            totalmem: os.totalmem(),
            freemem: os.freemem(),
            memoryUsage: process.memoryUsage(),
            cpuUsage,
        });
    });
    app.listen(PORT, () => console.log('Example app listening on port ', PORT));
})();

