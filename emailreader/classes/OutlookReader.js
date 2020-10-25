const EmailReader = require("./EmailReader");
const Imap = require("imap");
const simpleParser = require("mailparser").simpleParser;
const { EventEmitter } = require("events");

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

class OutlookReader extends EmailReader {
  server = null;
  keyword = "body";
  authEvent = new EventEmitter();
  doneEvent;

  results = [];

  constructor(emailaddress, password) {
    super();
    this.emailaddress = emailaddress;
    this.password = password;
    this.getEmail.bind(this)();
    this.imapFetch = this.fetchfromInbox.bind(this);
  }

  authenticate = () => {
    this.server = new Imap({
      user: this.emailaddress,
      password: this.password,
      host: "outlook.office365.com",
      port: 993,
      tls: true,
    });
    try {
      this.server.once("ready", (err) => {
        if (!err) {
          this.isAuthenticated = true;
          this.authEvent.emit("authenticated");
          console.log("Authenticated!");
        }
      });

      this.server.once("error", function (err) {
        console.log(err);
      });

      this.server.once("end", function () {
        console.log("Connection ended");
      });

      this.server.connect();
    } catch (e) {
      console.error(e);
    }
  };

  async openInbox(cb) {
    this.server.openBox("INBOX", true, cb);
  }

  async fetchfromInbox() {
    var f = this.server.seq.fetch("1:*", {
      bodies: "",
    });

    f.on("message", (msg, seqno) => {
      var prefix = "(#" + seqno + ") ";
      msg.on("body", (stream, info) => {
        var buffer = "";
        stream.on("data", (chunk) => {
          buffer += chunk.toString("utf8");

          simpleParser(buffer.toString("utf8")).then((res) => {
            this.pushToResults(res);

            // console.log(`FROM: ${res.from.text}`);
            // console.log(`MESSAGE ${res.text}`);
          });
        });
        stream.once("end", async function () {
          // console.log("stream ended");
        });
      });
    });

    f.once("error", (err) => {
      console.log("Fetch error: " + err);
    });

    f.once("end", () => {
      console.log("Done fetching all messages!");
      this.server.end();
      const resArray = this.results;

      const keywordEmails = resArray.filter((email) => {
        return email["text"].includes(this.keyword);
      });

      const retArray = keywordEmails.map((email) => {
        return {
          sender: email.from.text,
          message: email.text,
        };
      });

      // Send an event to the calling class
      this.doneEvent.emit("all emails received", retArray);
    });
  }

  pushToResults(res) {
    this.results.push(res);
  }

  getEmail(keyword, doneEvent) {
    this.doneEvent = doneEvent;
    this.keyword = keyword;
    console.log("getting emails");
    this.authEvent.on("authenticated", () => {
      this.openInbox(this.imapFetch);
    });
  }
}

module.exports = OutlookReader;
