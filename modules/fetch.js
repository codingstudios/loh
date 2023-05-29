import { parse, stringify, toJSON } from 'flatted';

export const fetch = ({ axios, chalk, config , UA, error }) => {
    const fetchError = (message, showExample = true) => error(message, "FETCH", showExample ? `${chalk.green(`loh fetch`)} <url:required> <method> <data> <output> <type> <repeat> <wait> <relay>` : null);
    var { url, method, output, display, repeat, wait = 0, headers = {}, body, userAgent, proxy, timeout } = config;
    if(!url) return fetchError("URL not provided");
    if(!method) return fetchError("Unknown request method");
    if(repeat == 0) return fetchError("Repeat value must be 1 or above");
    if(!userAgent) {
        const ua = UA.toString();
        console.log(`
    ${chalk.green("User Agent:")} ${chalk.yellow.bold(`Random`)} ${chalk.dim(`(${ua})`)}`);
        headers["User-Agent"] = ua;
    }
    const packet = {
        url, method, headers, data: body, proxy, timeout: null
    };
    function runFetch() {
        axios(packet).then(response => {
        console.log(`    ${chalk.green(`Status Code:`)} ${chalk.green.bold(response.status)} ${chalk.dim(`[${response.timings.elapsedTime}ms]`)}`)
        const data = JSON.stringify(response.data);
        console.log(chalk.dim(`    ${data.length > 50 ? `${data.slice(1,50)}...` : `${data}`}\n`))
        }).catch(err=> {
        if(err.response) {
        console.log(`    ${chalk.green(`Status Code:`)} ${chalk.red.bold(err.response.code)}`)
        const data = JSON.stringify(err.response.data);
        console.log(chalk.dim(`    ${data.length > 50 ? `${data.slice(1,50)}...` : `${data}`}`))
        }else {
        console.log(`    ${chalk.green(`Status Code:`)} ${chalk.red.bold(err.code)} ${chalk.dim(`[Axios Error]`)}`)
        console.log(chalk.dim(`    ${err.message}`))
        }
        })
    }
    var totalWaited = 0;
    Array.from({length: repeat}, () => setTimeout(() => runFetch(), totalWaited += wait));
}