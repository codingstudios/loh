import { parse, stringify, toJSON } from "flatted";
import * as prettier from "prettier";
import fs from "fs";

export const fetch = ({ axios, chalk, config, UA, error }) => {
  const fetchError = (message, showExample = true) =>
    error(
      message,
      "FETCH",
      showExample
        ? `${chalk.green(
            `loh fetch`
          )} <url:required> <method> <data> <output> <type> <repeat> <wait> <relay>`
        : null
    );
  var {
    url,
    method,
    output,
    display,
    repeat,
    wait = 0,
    headers = {},
    body,
    userAgent,
    proxy,
    timeout,
    useRelay
  } = config;
  if (!url) return fetchError("URL not provided");
  if (!method) return fetchError("Unknown request method");
  if (repeat == 0) return fetchError("Repeat value must be 1 or above");
  if (!userAgent) {
    const ua = UA.toString();
    console.log(`
    ${chalk.green("User Agent:")} ${chalk.yellow.bold(`Random`)} ${chalk.dim(
      `(${ua})`
    )}`);
    headers["User-Agent"] = ua;
  } else {
    console.log(`
    ${chalk.green("User Agent:")} ${chalk.yellow.bold(`Custom`)} ${chalk.dim(
      `(${userAgent})`
    )}`);
    headers["User-Agent"] = userAgent;
  }
  if(useRelay) {
    console.log(`    ${chalk.blue.bold("Using Relay")} ${chalk.dim(
      `(${useRelay.url})`
    )}`);
  }
  const packet = {
    url,
    method,
    headers,
    data: body,
    proxy,
    timeout,
  };
  function runFetch(rp) {
    axios(useRelay ? {
      url: useRelay.url,
      method: "POST",
      data: {
        password: useRelay.password,
        ...packet
      }
    } : packet)
      .then(async (response) => {
        console.log(
          `    ${chalk.green(`Status Code:`)} ${chalk.green.bold(
            response.status
          )} ${chalk.dim(`[${response.timings.elapsedTime}ms]`)}`
        );
        const data = JSON.stringify(response.data);
        console.log(
          chalk.dim(
            `    ${data.length > 50 ? `${data.slice(1, 50)}...` : `${data}`}\n`
          )
        );
        if (output) {
          fs.writeFileSync(
            `${repeat > 1 ? `(${rp}) ` : ""}${output}`,
            await prettier.format(stringify(response), { parser: "babel" })
          );
        }
        if (display) {
          console.log(
            `    ${chalk.green(`Content:`)}\n${response?.data
              .split("\n")
              .map((line, index) => `    ${index == 0 ? "" : "    "}${line}`)
              .join("\n")}`
          );
        }
      })
      .catch(async (err) => {
        if (err.response) {
          console.log(
            `    ${chalk.green(`Status Code:`)} ${chalk.red.bold(
              err.response.code
            )}`
          );
          const data = JSON.stringify(err.response.data);
          console.log(
            chalk.dim(
              `    ${data.length > 50 ? `${data.slice(1, 50)}...` : `${data}`}`
            )
          );
          if (display) {
            console.log(
              `    ${chalk.green(`Content:`)}\n${err?.response?.data
                ?.split("\n")
                .map((line, index) => `    ${index == 0 ? "" : "    "}${line}`)
                .join("\n")}`
            );
          }
        } else {
          console.log(
            `    ${chalk.green(`Status Code:`)} ${chalk.red.bold(
              err.code
            )} ${chalk.dim(`[Axios Error]`)}`
          );
          console.log(chalk.dim(`    ${err.message}`));
        }
        if (output) {
          fs.writeFileSync(
            `${repeat > 1 ? `(${rp}) ` : ""}${output}`,
            await prettier.format(stringify(err), { parser: "babel" })
          );
        }
      });
  }
  var totalWaited = 0;
  Array.from({ length: repeat }, () =>
    setTimeout(() => runFetch(totalWaited / repeat), (totalWaited += wait))
  );
};
