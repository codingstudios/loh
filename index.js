#! /usr/bin/env node
"use strict";

import fs from 'fs';
import chalk from 'chalk';
import axios from 'axios';
import resTime from './resTime.js';
import UserAgent from 'user-agents';
import { parse, stringify, toJSON } from 'flatted';
const pkg = JSON.parse(fs.readFileSync('./package.json'));
const UA = new UserAgent();

resTime(axios);

const command = process.argv[2];
var args = process.argv.slice(3) || [];
var config = {
    relays: [],
    log: {},
    proxy: {}
};
if(fs.existsSync("./config.json")) config = JSON.parse(fs.readFileSync('./config.json', 'utf-8'));
else fs.writeFileSync('./config.json', JSON.stringify(config));
var log = config?.log || {};
var url;
var method;
var data;
var output;
var headers;
var remove = false;
var type;
var repeat;
var useRelay = false;
var wait = 0;
var userAgent;
var useProxy;

const commands = {
    fetch, relay, version, ["-v"]: version, ["--version"]: version, help, ["-h"]: help, ["--help"]: help, proxy
};

function getArgsData(type, arg) {
    if(arg.length == 0) return log[`${type}`];
    else return arg;
}

function getArgs() {
if(!args || args.length == 0) return;
args.forEach((e, i) => {
    switch(e) {
        case "-u":
        case "--url":
            url = getArgsData("url", args[i+1]);
        break;
        case "-m":
        case "--method":
            method = getArgsData("method", args[i+1]);
        break;
        case "-d":
        case "--data":
            data = getArgsData("data", args[i+1]);
        break;
        case "-o":
        case "--output":
            output = getArgsData("output", args[i+1]);
        break;
        case "-t":
        case "--type":
            type = getArgsData("type", args[i+1]);
        break;
        case "-r":
        case "--repeat":
        if(isNaN(Number(args[i+1]))) return error("Invalid repeat value", args[i+1], '-r or --repeat <number>');
            repeat = getArgsData("repeat", args[i+1]);
        break;
        case "-w":
        case "--wait":
        if(isNaN(Number(args[i+1]))) return error("Invalid wait value", args[i+1], '-w or --wait <number>');
            wait = getArgsData("wait", args[i+1]);
        break;
        case "-re":
        case "--relay":
            useRelay = true;
        break;
        case "-rm":
        case "--remove":
            remove = true;
        break;
        case "-H":
        case "--headers":
            headers = getArgsData("headers", args[i+1]);
        break;
        case "-ua":
        case "--useragent":
            userAgent = getArgsData("useragent", args[i+1]);
        break;
        case "-p":
        case "--proxy":
            if(!config?.proxy) return error("No proxy was found", "PROXY", `${chalk.green(`loh proxy`)}`);
            useProxy = config?.proxy;
        break;
    }
})
}

getArgs();
if(command == "rr" || command == "rerun") {
    if(!log?.command || log?.command == "rr") error("No command to rerun"); 
    else { args = log.args; getArgs(); commands[log?.command](); }
}else {
    if(!command) help()
    else if(command && !commands[`${command}`]) error("Command not found");
    else { commands[`${command}`](); fs.writeFileSync('./config.json', JSON.stringify({ ...config, log: { url, method, useRelay, useProxy, data, output, command, args, type, userAgent, headers } })); }
}

if(!isNaN(repeat)) {
    for(let i = 0; i < repeat; i++)  {
        setTimeout(() => {
        commands[log?.command]();
        }, wait * i);
    }
}

function parseType(type, data) {
    const separator = type.split("|");
    var output = "";
    separator.forEach((e) => {
        output += `${typeof data?.[`${e}`] == 'object' ? stringify(data?.[`${e}`]) : data?.[`${e}`]}\n`;
    });
    return output;
}

function json(str) {
    try {
        return JSON.parse(str);
    } catch (e) {
        return str;
    }
}

function fetch() {
    const fetchError = (message, showExample = true) => error(message, "FETCH", showExample ? `${chalk.green(`loh fetch`)} <url:required> <method> <data> <output> <type> <repeat> <wait> <relay>` : null);
    if(!url) return fetchError("No URL provided");
    var packet = {
        proxy: useProxy, method: method ? method : 'GET', url, data: json(data), headers: { "User-Agent": userAgent ? userAgent : UA.toString(), ...json(headers) }
    };
    if(useRelay && config?.relays?.length > 0) packet = { url: config.relays[Math.floor(Math.random() * config.relays.length)], data: packet, method: "POST" };
    else if(useRelay && config?.relays?.length == 0) fetchError("No relays were found, using local fetch...", false);
    axios(packet).then(res => {
      var data;
      if(type) data = parseType(type, res);
      else data = res;
      if(typeof data == "object") data = stringify(data);
      if(output){
        fs.writeFileSync(output, `${data}`);
        response("Data saved to " + output);
      }
      response(`
    ${useRelay ? chalk.blue(`RELAY `) : ''}Fetched data with status code ${res.status}
    User Agent: ${chalk.yellow(userAgent ? userAgent : 'Random')}
    ${res?.data ? chalk.grey((`${typeof res?.data == 'object' ? JSON.stringify(res?.data) : res?.data}`).substring(0,100)) : 'No Response Data'}
      `);
    }).catch(err => {
        var data;
        repeat = 0;
        if(type) data = parseType(type, err);
        else data = err;
        if(typeof data == "object") data = stringify(data);
        if(output){
           fs.writeFileSync(output, `${data}`);
           response("Error log saved to " + output);
         }
        return fetchError(`${useRelay ? `${chalk.yellow(`Relay used: ${packet.url}`)} ` : ''}
        ${err}
        ${err.response.data ? chalk.grey(err.response.data.substring(0, 100)) : 'No response data'}
`);
    })
}


function proxy() {
    const proxyError = (message, showExample = true) => error(message, "PROXY");
    if(!args[0]) {
        if(!config?.proxy) return proxyError("No proxy was found");
        else return response(`Current proxy: ${stringify(config.proxy)}`);
    }else {
    if(remove) { config.proxy = {}; return response("Proxy removed"); }
       try {
         config.proxy = JSON.parse(args[0]);
         response(`Proxy set to ${JSON.stringify(config.proxy)}`);
       }catch(e) {
            proxyError("Invalid proxy format");
       }
    }
 
}

function relay() {
    const relayError = (message) => error(message, "RELAY", `${chalk.green(`loh relay`)} <url: to add or remove> <remove: to remove>`);
    if(!Array.isArray(config?.relays)) config.relays = [];
    if(url) { 
    if(remove) {
    const index = config?.relays?.indexOf(`${url}`);
    if (index > -1) { config?.relays?.splice(index, 1); return response("Removed relay " + url); }
    else return relayError("Relay url not found");
    }else {
    if(config?.relays?.includes(`${url}`)) return relayError("relay url already exist.");
    config.relays.push(url);
    fs.writeFileSync('./config.json', JSON.stringify(config));
    return response("Relay added", url);
    }
    }else {
        if(config.relays.length == 0) return relayError("No relays were found");
        var rp = '';
        rp += `Relays: ${config.relays.length}\n`;
        config.relays.forEach((e, i) => {
            rp += `
            ${chalk.yellow(`${i+1}. ${e}`)}`
        })
        return response(rp);
    }
}

function error(message, error, example) {
    console.log(chalk.red(`
        ${message ? chalk.magenta(`loh error: ${error}`) : ''}
        Error: 
            ${message}
        ${example ? chalk.blue(`Example: ${example}`) : ''}
    `));
}

function response(...message) {
    console.log(chalk.green(`
         ${message.join(" ")}
    `));
}

async function version() {
const { data } = await axios.get("https://raw.githubusercontent.com/codingstudios/loh/main/package.json");
console.log(`
    ${logo()}
    --------------------
    Latest Version: ${chalk.green(`v${data.version}`)}
    --------------------

    Github: ${chalk.yellow(`https://github.com/CodingStudios/loh`)}
    Author: ${chalk.green(`https://github.com/leecheeyong`)} & ${chalk.green(`https://github.com/joeleeofficial`)}
    License: ${chalk.blue(`AGPL-3.0 (https://github.com/CodingStudios/loh/blob/main/LICENSE)`)}

    ${chalk.grey(`Use ${chalk.green(`loh help`)} to view all commands`)}
`);
}

function help() {
console.log(`
    ${logo()}
    Github: ${chalk.yellow(`https://github.com/CodingStudios/loh`)}
    Author: ${chalk.green(`https://github.com/leecheeyong`)} & ${chalk.green(`https://github.com/joeleeofficial`)}
    License: ${chalk.blue(`AGPL-3.0 (https://github.com/CodingStudios/loh/blob/main/LICENSE)`)}


    Commands:
    ${chalk.magenta(`
    fetch (f)       Do a fetch request
    rerun (rr)      Rerun previous command with its options
    relay (p)       Add or remove relays
    version (v)     View current and latest version
    help (h)        View all commands
    `)}
    Options:
    ${chalk.magenta(`
    -u, --url         Url to fetch
    -t, --type        Type of data to output
    -o, --output      Output file to save data
    -m, --method      Method to use
    -re, --relay       Use relay
    -rm, --remove     Remove 
    -d, --data        Body of the request
    -H, --headers     Headers of the request
    -ua, --useragent  User agent of the request
    `)}
    Usage: ${chalk.blue(`loh <command> [options]`)}
    Example: ${chalk.yellow(`loh fetch -u https://example.com -method GET`)}

`)
} 

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

/*
    APG-3.0 License: https://github.com/codingstudios/loh/blob/main/LICENSE
    Author: Lee Chee Yong
*/
