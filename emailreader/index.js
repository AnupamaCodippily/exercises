const GmailReader = require("./classes/GmailReader");
const OutlookReader = require("./classes/OutlookReader");
const YahooReader = require("./classes/YahooReader");
const {promisify} = require('util')
const EventEmitter = require('events').EventEmitter

const mailReader = new GmailReader("username@gmail.com", "your password");
const yahoo_mailReader = new GmailReader("username@yahoo.com", "your password");
const outlook_mailReader = new OutlookReader("username@outlook.com", "your password");

async function main() {
  mailReader.authenticate();

  const eventEmitter = new EventEmitter()

  mailReader.getEmail("some message body", eventEmitter)

  eventEmitter.on("all emails received", res => {
    return(res)
  })
}

main();
