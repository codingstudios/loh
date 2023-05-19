import { SocksProxyAgent } from 'socks-proxy-agent';
import { parse, stringify, toJSON } from 'flatted';

export const fetch = ({ axios, chalk, config , UA, error }) => {
    const fetchError = (message, showExample = true) => error(message, "FETCH", showExample ? `${chalk.green(`loh fetch`)} <url:required> <method> <data> <output> <type> <repeat> <wait> <relay>` : null);
    var { url, method, output, display, repeat, wait, headers = {}, body, userAgent, proxy } = config;
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
        url, method, headers, data: body, proxy
    };
    function runFetch() {
        axios(packet).then(response => {
        console.log(`    ${chalk.green(`Status Code:`)} ${chalk.green.bold(response.status)}`)
            const data = JSON.stringify(response.data);
        console.log(chalk.dim(`    ${data.length > 50 ? `${data.slice(1,50)}...` : `${data}`}`))
        })
    }
    Array.from({length: repeat}, () => runFetch());
}