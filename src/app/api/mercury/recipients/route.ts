// Retrieve information about all of your recipients

import fetch from "node-fetch";

const url = "https://api.mercury.com/api/v1/recipients";

const options = {
  method: "GET",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.MERCURY_SECRET_TOKEN}`,
  },
};

fetch(url, options)
  .then((res) => res.json())
  .then((json) => console.log(json))
  .catch((err) => console.error("error:" + err));
