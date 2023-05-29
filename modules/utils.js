import fs from "fs";
import chalk from "chalk";
const pkg = JSON.parse(fs.readFileSync("./package.json"));

export const logo = () => {
  return `
        ${chalk.yellow(`==     ===     ==`)}
        ${chalk.blue(`==   ==   ==   =======`)}
        ${chalk.red(`==   ==   ==   ==   ==`)}
    ${chalk.green(`=== ==   ==   ==   ==   ==`)}
    ${chalk.yellow(`=== ==     ===     ==   ==`)}

            ${chalk.blue(`loh ${chalk.blue(`v${pkg.version}`)}`)}
    `
    .split("=")
    .join(`${["$", "=", "/"][Math.floor(Math.random() * 3)]}`);
};

export const error = (message, error, example) => {
  console.log(
    chalk.red(`
    ${message ? chalk.magenta(`loh error: ${error}`) : ""}
    Error: 
        ${message}
    ${example ? chalk.blue(`Example: ${example}`) : ""}
`)
  );
};
