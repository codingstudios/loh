# loh
Make http request on cli with ease

<a href="https://npmjs.com/loh"><img src="https://badge.fury.io/js/loh.svg"></a>
  
## Installation

Use package managers:
```bash
npm install -g loh # npm
yarn global add loh # yarn
npx loh 
```

## Usage

### Fetch request
You can do a fetch request using [axios](https://npmjs.com/axios) with ease
```
$ loh fetch --url https://example.com
```

### Re-run commands
You can easily rerun previous commands (and make changes) 
```
$ loh rerun 
```

Run `loh help` to see the list of available commands and options

## Options

| **Option** | **Description** | **Example** |
| ---------- | --------------- | ----------- |
| `-u`, `--url` | Specify the url to make request to | `loh fetch -u https://example.com` |
| `-m`, `--method` | Specify the request method | `loh fetch -u https://example.com -m POST` |
| `-o`, `--output` | Specify a filename for response output | `loh fetch -u https://loh.js.org -o output.txt` |
| `-d`, `--display` | Display some output data as preview | `loh fetch -u https://loh.js.org --display` |
| `-r`, `--repeat` | Specify the amount of requests to make repeatedly | `loh fetch -u https://loh.js.org -r 5` |
| `-w`, `--wait` | Specify the time to wait in (ms) before the next request is made | `loh fetch -u https://loh.js.org --wait 1000 -r 5` |
| `-H`, `--headers` | Set the request header | `loh fetch -u https://loh.js.org --headers '{"Authorization": "Bearer 1234"}'` |
| `-B`, `--body` | Set the request body | `loh fetch -u https://loh.js.org --method POST --body '{"value": "hello world"}'` |
| `-p`, `--proxy` | Set the request proxy | `loh fetch -u https://loh.js.org --proxy user:password@127.0.0.1:9050` |
| `--relay` | Use a random fetch relay to make the request | `loh fetch -u https://loh.js.org --relay` |

## Configure Relays
loh supports [Relay Server](https://github.com/codingstudios/relay-server)
```
# add relay
$ loh --addrelay https://relayserver.example

# remove relay
$ loh --removerelay https://relayserver.example

# list relay
$ loh --listrelays https://relayserver.example
```


## Contributors
- [@leecheeyong](https://github.com/leecheeyong)
- [Contributors from @CodingStudios](https://github.com/codingstudios)


## License

This project is available as open source under the terms of the [AGPL-3.0 License](https://github.com/codingstudios/loh/blob/main/LICENSE)