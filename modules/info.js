export const help = ({ logo, chalk }) => {
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
    -re, --relay      Use relay
    -rm, --remove     Remove 
    -d, --data        Body of the request
    -H, --headers     Headers of the request
    -ua, --useragent  User agent of the request
    `)}
    Usage: ${chalk.blue(`loh <command> [options]`)}
    Example: ${chalk.yellow(`loh fetch -u https://example.com -method GET`)}

    `)
}

export const version = async ({ axios, chalk, logo }) => {
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