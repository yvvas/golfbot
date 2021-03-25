# golfbot CLI

A CLI for golfbot.

## :white_check_mark: Prerequisites

You will need...

### Node.js 14+

* OSX: `brew install node` using [Homebrew](http://brew.sh/)
* Linux: `apt install nodejs` ([see Ubuntu/Debian specific instructions](https://nodejs.org/en/download/package-manager/#debian-and-ubuntu-based-linux-distributions)) or `pacman -S nodejs` (Arch Linux)
* Windows: [Install](https://nodejs.org/en/download/)

## :package: Installation

1. Please enter your account details in the `.env.sample` file, and rename to `.env`
2. Run `npm link` so our new app is recognized in your command-line

## :electric_plug: Run

1. Set your desired times, and courses in the `config.js`
2. Try it by running `golfbot`

## :robot: Deploment

We're going to use cron to run this every morning.

1. Start a new crontab task `crontab -e`
2. Type in `0 6 * * * cd ~/documents/golfbot && golfbot` and save
3. Profit

## :pill: Tests & Code Quality

TBD

## :heart: Built With

* [Gluegun](https://infinitered.github.io/gluegun/#/) - The framework

## License

MIT - see LICENSE
