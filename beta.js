#! /usr/bin/env node
"use strict";

import chalk from "chalk";
import axios from "axios";
import minimist from "minimist";
import resTime from "./resTime.js";
import UserAgent from "user-agents";
import { logo, error } from "./modules/utils.js";
const UA = new UserAgent();

import { help, version } from "./modules/info.js";
import { fetch } from "./modules/fetch.js";

resTime(axios);

const args = minimist(process.argv.slice(2));
const command = args?._;

var config = {
  method: "GET",
  repeat: 1,
};

for (var option in args) {
  switch (option) {
    case "u":
    case "url":
      config.url = args[option]; // url to request
      break;

    case "m":
    case "method":
      config.method = args[option]; // request method
      break;

    case "o":
    case "output":
      config.output = args[option]; // output file
      break;

    case "d":
    case "display":
      config.display = true; // display portion data
      break;

    case "r":
    case "repeat":
      if (isNaN(Number(args[option])))
        error(
          "Invalid repeat value:",
          args[option],
          "[-r or --repeat <number>]"
        );
      config.repeat = Number(args[option]); // repeat request
      break;

    case "w":
    case "wait":
      if (isNaN(Number(args[option])))
        error(
          "Invalid wait value:",
          args[option],
          "[-w or --wait <milliseconds>]"
        );
      config.wait = Number(args[option]); // wait before request
      break;

    case "H":
    case "headers":
      config.headers = JSON.parse(args[option]); // request header
      break;

    case "b":
    case "body":
      config.body = args[option]; // request body

    case "useragent":
      config.userAgent = args[option]; // request user agent
      break;

    case "t":
    case "timeout":
      config.timeout = args[option]; // request timeout in milliseconds
      break;

    case "p":
    case "proxy":
      var value = args[option].split("@");
      var user = value.length == 2 ? value[0] : null;
      var proxy = (value.length == 1 ? value[0] : value[1]).split(":");
      if (user)
        user = {
          username: user.split(":")[0],
          password: user.split(":")[1],
        };
      config.proxy = {
        // request proxy
        host: proxy[0],
        port: proxy[1],
        user,
      };
      break;
  }
}

console.log(config);

if (command == "help" || args.help)
  help({
    command,
    logo,
    chalk,
  });
if (command == "version" || args.version)
  version({
    axios,
    logo,
    chalk,
  });
if (command == "fetch" || args.fetch)
  fetch({
    axios,
    chalk,
    config,
    UA,
    error,
  });
