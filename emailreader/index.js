const GmailReader = require("./classes/GmailReader");
const {promisify} = require('util')
const EventEmitter = require('events').EventEmitter

const mailReader = new GmailReader("username@email.com", "your password");

async function main() {
  mailReader.authenticate();

  const eventEmitter = new EventEmitter()

  mailReader.getEmail("some message body", eventEmitter)

  eventEmitter.on("all emails received", res => {
    return(res)
  })
}

main();
