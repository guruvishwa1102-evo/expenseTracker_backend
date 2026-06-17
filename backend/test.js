const dns = require("dns");

dns.resolveSrv(
  "_mongodb._tcp.gvcluster0.l46mvo5.mongodb.net",
  (err, addresses) => {
    if (err) {
      console.error("DNS ERROR:");
      console.error(err);
    } else {
      console.log("SUCCESS:");
      console.log(addresses);
    }
  }
);