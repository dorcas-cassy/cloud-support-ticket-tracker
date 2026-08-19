const express = require("express");
const path = require("path");

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));

app.get("/", function (request, response) {
    response.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, "0.0.0.0", function () {
    console.log(`Cloud Support Ticket Tracker is running.`);
    console.log(`Open http://localhost:${PORT}`);
});