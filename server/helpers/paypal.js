const paypal = require("paypal-rest-sdk");

paypal.configure({
  mode: "sandbox",
  client_id: "ARhzxqY_xkzrIjfOXK6qkSfIsKVwd3DC4_tAnIJ-bKbaGdBs1Hav63E0pVSJHVkDzozpM39p0osMiWc-",
  client_secret: "EFO-zNrm82_RFyjdgUO-75tKRc1z4hnzgEAOnIJEBc28AmHAW7ctQ9qfiDvhjkyggOhnefRhrnrKpwgN",
});

module.exports = paypal;
