const express = require("express");
const fs = require("node:fs");
const path = require("node:path");

const initialTickets = [
    { id: 1001, title: "Unable to connect to office Wi-Fi", requester: "Maya Chen", category: "Network", priority: "High", status: "Open" },
    { id: 1002, title: "Password reset for finance portal", requester: "Jonas Weber", category: "Account", priority: "Medium", status: "In Progress" },
    { id: 1003, title: "Microsoft Teams microphone not detected", requester: "Amina Yusuf", category: "Software", priority: "Low", status: "Resolved" }
];
const categories = new Set(["Network", "Account", "Software", "Hardware"]);
const priorities = new Set(["Low", "Medium", "High"]);

function createApp(dataFile = process.env.DATA_FILE || path.join(__dirname, "data", "tickets.json")) {
    fs.mkdirSync(path.dirname(dataFile), { recursive: true });
    if (!fs.existsSync(dataFile)) fs.writeFileSync(dataFile, JSON.stringify(initialTickets, null, 2));
    const tickets = JSON.parse(fs.readFileSync(dataFile, "utf8"));
    if (!Array.isArray(tickets)) throw new Error("Ticket data must be an array");

    function save() {
        const temporaryFile = `${dataFile}.tmp`;
        fs.writeFileSync(temporaryFile, JSON.stringify(tickets, null, 2));
        fs.renameSync(temporaryFile, dataFile);
    }

    const app = express();
    app.disable("x-powered-by");
    app.use(express.json({ limit: "16kb" }));
    app.get("/health", (_request, response) => response.json({ status: "ok" }));
    app.get("/api/tickets", (_request, response) => response.json(tickets));

    app.post("/api/tickets", (request, response) => {
        const { title, requester, category, priority } = request.body || {};
        if (typeof title !== "string" || !title.trim() || title.trim().length > 120 ||
            typeof requester !== "string" || !requester.trim() || requester.trim().length > 80 ||
            !categories.has(category) || !priorities.has(priority)) {
            return response.status(400).json({ error: "Enter a title, requester, category, and priority." });
        }

        const ticket = {
            id: tickets.reduce((max, item) => Math.max(max, item.id), 1000) + 1,
            title: title.trim(), requester: requester.trim(), category, priority, status: "Open"
        };
        tickets.unshift(ticket);
        try { save(); } catch (_) {
            tickets.shift();
            return response.status(500).json({ error: "Could not save ticket." });
        }
        return response.status(201).json(ticket);
    });

    app.patch("/api/tickets/:id/status", (request, response) => {
        const ticket = tickets.find(item => item.id === Number(request.params.id));
        if (!ticket) return response.status(404).json({ error: "Ticket not found." });
        const nextStatus = ticket.status === "Open" ? "In Progress" :
            ticket.status === "In Progress" ? "Resolved" : null;
        if (!nextStatus) return response.status(409).json({ error: "Ticket is already resolved." });

        const previousStatus = ticket.status;
        ticket.status = nextStatus;
        try { save(); } catch (_) {
            ticket.status = previousStatus;
            return response.status(500).json({ error: "Could not update ticket." });
        }
        return response.json(ticket);
    });

    app.get("/", (_request, response) => response.sendFile(path.join(__dirname, "index.html")));
    app.get("/script.js", (_request, response) => response.sendFile(path.join(__dirname, "script.js")));
    app.get("/style.css", (_request, response) => response.sendFile(path.join(__dirname, "style.css")));
    return app;
}

if (require.main === module) {
    const port = Number(process.env.PORT) || 3000;
    createApp().listen(port, "0.0.0.0", () => console.log(`Cloud Support Ticket Tracker listening on port ${port}`));
}

module.exports = { createApp };
