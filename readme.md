# loh
Make http request on cli with ease

<a href="https://npmjs.com/loh"><img src="https://badge.fury.io/js/loh.svg"></a>
  
## Installation

Use package managers:
```bash
npm install -g loh # npm
yarn global add loh # yarn
```

## Usage

### Fetch request
You can do a fetch request using [axios](https://npmjs.com/axios) with ease
```
$ loh fetch --url https://example.com
```

### Re-run command with options
You can easily rerun previous commands, such as fetch without re-inputting the options 
```
$ loh rerun 
# This will run the previous command in the background without having you to retype them
```

You can also see the list of available commands using the `loh help` command.

## Options

### Repeat & delay
You can easily do a same fetch request multiple times with the option to set a delay for each request
```
$ loh fetch -u https://example.com --repeat 10 # Do a fetch request 11 times (repeat the same fetch 10 times)
$ loh fetch -u https://example.com --repeat 10 -wait 2000 # Do a total of 11 fetch request with 2000 milliseconds of delay each
```

### Set Headers
Set a JSON header 
```
$ loh fetch -u https://example.com --headers '{"Authorization":"123456"}' --method POST
```

### Set body
Set the request body as text or JSON 
```
$ loh fetch -u https://example.com --body '{"value":"hello"}' --method POST
```

### Set User Agent
Set the user agent (**Note: a random user agent will be generated and used automatically**)
```
$ loh fetch -u https://example.com --useragent loh
```

### Set Output & format data
Set a file to save output data
```
$ loh fetch -u https://example.com --output ./output.txt
$ loh fetch -u https://example.com --output ./output.txt  --type 'status|data|timings'
```
Example output data of the second line:
```
200
This is a response body
[{"timingEnd":1666711647530,"timingStart":1666711647117,"elapsedTime":413}]
```

## Proxy
Use a proxy server
### Use proxy server to do a request
```
$ loh fetch --url https://example.com -p
```
#### Set a proxy server
```
$ loh proxy '{"proxy":{"host":"proxy-url","port":80,"auth":{"username":"my-user","password":"my-password"}}'
```
#### Remove proxy 
```
$ loh proxy --remove
```

## Relay
loh supports [relay-server](https://github.com/codingstudios/Fetch-Relay/tree/main/relayServer)
### Use relay in a request
```
$ loh fetch -u https://example.com --relay
```
#### Set relay
```
$ loh relay --url https://proxy.example.com
```
#### Delete relay
```
$ loh relay --url https://proxy.example.com --remove
```
#### View the list of relays
```
$ loh relay
```




