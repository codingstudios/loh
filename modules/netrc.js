import fs from "fs";
import path from "path";

const join = path.join;

export default {
  storage: (file) => {
    var home = getHomePath();

    if (!file && !home) return {};
    file = file || join(home, ".netrc");

    if (!file || !fs.existsSync(file)) return {};
    var netrc = fs.readFileSync(file, "UTF-8");
    return exports.parse(netrc);
  },
  parse: (content) => {
    var lines = content.split("\n");
    for (var n in lines) {
      var i = lines[n].indexOf("#");
      if (i > -1) lines[n] = lines[n].substring(0, i);
    }
    content = lines.join("\n");

    var tokens = content.split(/[ \t\n\r]+/);
    var machines = {};
    var m = null;
    var key = null;
    if (tokens[0] === "") tokens.shift();
    for (var i = 0, key, value; i < tokens.length; i += 2) {
      key = tokens[i];
      value = tokens[i + 1];
      if (!key || !value) continue;

      if (key === "machine") {
        m = {};
        machines[value] = m;
      } else {
        m[key] = value;
      }
    }

    return machines;
  },
  format: (machines) => {
    var lines = [];
    var keys = Object.getOwnPropertyNames(machines).sort();

    keys.forEach(function (key) {
      lines.push("machine " + key);
      var machine = machines[key];
      var attrs = Object.getOwnPropertyNames(machine).sort();
      attrs.forEach(function (attr) {
        if (typeof machine[attr] === "string")
          lines.push("    " + attr + " " + machine[attr]);
      });
    });
    return lines.join("\n");
  },
  save: (machines) => {
    var home = getHomePath();
    var destFile = join(home, ".netrc");
    var data = exports.format(machines) + "\n";
    fs.writeFileSync(destFile, data);
  },
};

function getHomePath() {
  return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}
