const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { createApp } = require("./server");

test("tickets are validated, updated, persisted, and private files are not served", async () => {
    const directory = fs.mkdtempSync(path.join(os.tmpdir(), "tickets-test-"));
    const dataFile = path.join(directory, "tickets.json");
    const server = createApp(dataFile).listen(0, "127.0.0.1");
    try {
        await new Promise(resolve => server.once("listening", resolve));
        const base = `http://127.0.0.1:${server.address().port}`;
        const initial = await (await fetch(`${base}/api/tickets`)).json();
        assert.equal(initial.length, 3);

        const invalid = await fetch(`${base}/api/tickets`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "", requester: "A", category: "Network", priority: "High" })
        });
        assert.equal(invalid.status, 400);

        const created = await fetch(`${base}/api/tickets`, {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: "  VPN issue  ", requester: "  Ada  ", category: "Network", priority: "High" })
        });
        assert.equal(created.status, 201);
        const ticket = await created.json();
        assert.equal(ticket.title, "VPN issue");
        assert.equal(ticket.id, 1004);

        const updated = await fetch(`${base}/api/tickets/${ticket.id}/status`, { method: "PATCH" });
        assert.equal((await updated.json()).status, "In Progress");
        assert.equal((await fetch(`${base}/api/tickets/${ticket.id}/status`, { method: "PATCH" })).status, 200);
        assert.equal((await fetch(`${base}/api/tickets/${ticket.id}/status`, { method: "PATCH" })).status, 409);
        assert.equal((await fetch(`${base}/api/tickets/9999/status`, { method: "PATCH" })).status, 404);

        assert.equal((await fetch(`${base}/server.js`)).status, 404);
        assert.equal((await fetch(`${base}/data/tickets.json`)).status, 404);
        assert.equal(JSON.parse(fs.readFileSync(dataFile, "utf8"))[0].status, "Resolved");
    } finally {
        server.close();
        fs.rmSync(directory, { recursive: true, force: true });
    }
});
