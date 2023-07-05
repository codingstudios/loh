#! /usr/bin/env node
"use strict";

import chalk from "chalk";
import axios from "axios";
import minimist from "minimist";
import resTime from "./resTime.js";
import UserAgent from "user-agents";
import Storage from "./modules/storage.js";
import { logo, error } from "./modules/utils.js";
const UA = new UserAgent();
const storage = new Storage();

import { help, version } from "./modules/info.js";
import { fetch } from "./modules/fetch.js";
import { addRelay, removeRelay, listRelays } from "./modules/settings.js";

resTime(axios);

var args = minimist(process.argv.slice(2));
const command = args?._;

var config = {
  method: "GET",
  repeat: 1,
  history: {},
  ...storage.get(),
};

function processArgs() {
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

      case "B":
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

      case "relay":
        if (
          !config?.relays ||
          !Array.isArray(config?.relays) ||
          !config?.relays[0]
        )
          error(
            "No relays were found therefore can't be used",
            "FETCH",
            `${chalk.green(`loh --listrelays`)}`,
            true
          );
        const random =
          (config?.relays[
            Math.floor(Math.random() * config?.relays.length)
          ]).split("@");
        config.useRelay = {
          url: random[0],
          password: random[1] ? random[1] : null,
        };
        break;
    }
  }
}

const commands = {
  help,
  version,
  fetch,
  addRelay,
  removeRelay,
  listRelays,
};

(async () => {
  if (command == "rr" || command == "rerun") {
    const { history } = storage.get();
    if (!history?.command)
      error(
        "There are no previous command to be rerun",
        "lohjs",
        "lohjs <command>",
        true
      );
    args = {
      ...history?.args,
      ...args,
    };
    processArgs();
    runCommand(history?.command);
  } else {
    var storageData = storage.get();
    storageData = {
      ...storageData,
      history: {
        command,
        args,
      },
    };
    await storage.set(storageData);
    processArgs();
    if (command == "help" || args.help) runCommand("help");
    if (command == "version" || args.version) runCommand("version");
    if (command == "fetch" || args.fetch) runCommand("fetch");
    if (args.addrelay) runCommand("addRelay");
    if (args.removerelay) runCommand("removeRelay");
    if (args.listrelays) runCommand("listRelays");
  }
})();
function runCommand(command) {
  if (!commands[command])
    error("Invalid command:", command, "lohjs <command>", true);
  commands[command]({
    command,
    chalk,
    axios,
    logo,
    storage,
    config,
    UA,
    error,
    args,
  });
}

/*
    APG-3.0 License: https://github.com/codingstudios/loh/blob/main/LICENSE
    Author: Lee Chee Yong
*/
