#! /usr/bin/env node
"use strict";

import fs from 'fs';
import chalk from 'chalk';
import axios from 'axios';
import minimist from 'minimist';
import resTime from './resTime.js';
import UserAgent from 'user-agents';
import { parse, stringify, toJSON } from 'flatted';
const pkg = JSON.parse(fs.readFileSync('./package.json'));
const UA = new UserAgent();

import help from './modules/help.js';

resTime(axios);

const args = minimist(process.argv.slice(2));
console.log(args)
const command = args?._;

var config = {};

function logo() {
    return `
        ${chalk.yellow(`==     ===     ==`)}
        ${chalk.blue(`==   ==   ==   =======`)}
        ${chalk.red(`==   ==   ==   ==   ==`)}
    ${chalk.green(`=== ==   ==   ==   ==   ==`)}
    ${chalk.yellow(`=== ==     ===     ==   ==`)}

            ${chalk.blue(`loh ${chalk.blue(`v${pkg.version}`)}`)}
    `.split("=").join(`${["$", "=", "/"][Math.floor(Math.random() * 3)]}`)
}

if(command == "help" || args.help) help({
    command, logo, chalk
});

for(var option in args) {
    switch(option) {
        case "u":
        case "url": 
            config.url = args[option];
        break;
        
        case "m":
        case "method":
            config.method = args[option];
        break;

        case "o":
        case "output":
            config.output = args[option];
        break;

        case "d":
        case "display":
            config.display = true;
        break;

        case "r":
        case "repeat":
            if(isNaN(Number(args[option]))) return error("Invalid repeat value:", args[option], '[-r or --repeat <number>]');
            config.repeat = args[option];
        break;

        case "w":
        case "wait":
        if(isNaN(Number(args[i]))) return error("Invalid wait value:", args[option], '[-w or --wait <milliseconds>]');
            config.wait = args[option];
        break;

        case "H":
        case "headers":
            config.headers = args[option];
        break;

        case "ua":
        case "useragent":
            config.userAgent = args[option];
        break;

        case "p":
        case "proxy":
            var value = (args[option]).split("@");
            var user = value.length =! 1 ? value[0] : null;
            var proxy = (value.length > 1 ? value[1] : value[0]).split(":");
            if(user) user = {
                username: user.split(":")[0],
                password: user.split(":")[1]
            };
            config.proxy = {
                host: proxy[0], 
                port: proxy[1],
                user
            }
        break;
        
    }
}