#! /usr/bin/env node
"use strict";

import chalk from 'chalk';
import axios from 'axios';
import minimist from 'minimist';
import resTime from './resTime.js';
import UserAgent from 'user-agents';
import { parse, stringify, toJSON } from 'flatted';
import { logo, error } from './modules/utils.js';
const UA = new UserAgent();


import help from './modules/help.js';

resTime(axios);

const args = minimist(process.argv.slice(2));
const command = args?._;

var config = {};

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
            if(isNaN(Number(args[option]))) error("Invalid repeat value:", args[option], '[-r or --repeat <number>]');
            config.repeat = Number(args[option]);
        break;

        case "w":
        case "wait":
        if(isNaN(Number(args[option]))) error("Invalid wait value:", args[option], '[-w or --wait <milliseconds>]');
            config.wait = Number(args[option]);
        break;

        case "H":
        case "headers":
            config.headers = JSON.parse(args[option]);
        break;

        case "ua":
        case "useragent":
            config.userAgent = args[option];
        break;

        case "p":
        case "proxy":
            var value = (args[option]).split("@");
            var user = value.length == 2 ? value[0] : null;
            var proxy = (value.length == 1 ? value[0] : value[1]).split(":");
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

console.log(config)