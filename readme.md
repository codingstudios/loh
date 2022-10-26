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
