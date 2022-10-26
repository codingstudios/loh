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
$ loh fetch -u https://example.com
```

### Re-run command with options
You can easily rerun previous commands, such as fetch without re-inputting the options 
```
$ loh rerun 
# This will run the previous command in the background without having you to retype them

``
