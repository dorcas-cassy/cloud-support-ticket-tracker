const newTicketButton = document.getElementById("new-ticket-button");
const cancelButton = document.getElementById("cancel-button");
const ticketFormSection = document.getElementById("ticket-form-section");
const ticketForm = document.getElementById("ticket-form");
const ticketList = document.getElementById("ticket-list");
const statusFilter = document.getElementById("status-filter");
const message = document.getElementById("message");
const openCount = document.getElementById("open-count");
const progressCount = document.getElementById("progress-count");
const resolvedCount = document.getElementById("resolved-count");
let tickets = [];

async function requestJson(url, options) {
    const response = await fetch(url, options);
    const body = await response.json();
    if (!response.ok) throw new Error(body.error || "Request failed. Please try again.");
    return body;
}

function showMessage(text) {
    message.textContent = text;
    message.classList.toggle("hidden", !text);
}

newTicketButton.addEventListener("click", () => {
    ticketFormSection.classList.remove("hidden");
    document.getElementById("title").focus();
});
cancelButton.addEventListener("click", () => {
    ticketFormSection.classList.add("hidden");
    ticketForm.reset();
});

ticketForm.addEventListener("submit", async event => {
    event.preventDefault();
    const submitButton = ticketForm.querySelector('button[type="submit"]');
    submitButton.disabled = true;
    showMessage("");
    try {
        const ticket = await requestJson("/api/tickets", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: document.getElementById("title").value,
                requester: document.getElementById("requester").value,
                category: document.getElementById("category").value,
                priority: document.getElementById("priority").value
            })
        });
        tickets.unshift(ticket);
        ticketForm.reset();
        ticketFormSection.classList.add("hidden");
        statusFilter.value = "All";
        displayTickets();
    } catch (error) {
        showMessage(error.message);
    } finally {
        submitButton.disabled = false;
    }
});

statusFilter.addEventListener("change", displayTickets);

async function updateTicketStatus(ticket, button) {
    button.disabled = true;
    showMessage("");
    try {
        const updated = await requestJson(`/api/tickets/${ticket.id}/status`, { method: "PATCH" });
        ticket.status = updated.status;
        displayTickets();
    } catch (error) {
        showMessage(error.message);
        button.disabled = false;
    }
}

function displayTickets() {
    const selectedStatus = statusFilter.value;
    const filteredTickets = tickets.filter(ticket => selectedStatus === "All" || ticket.status === selectedStatus);
    ticketList.replaceChildren();
    if (filteredTickets.length === 0) {
        const empty = document.createElement("p");
        empty.id = "empty-message";
        empty.textContent = "No support tickets found in this category.";
        ticketList.appendChild(empty);
    }

    filteredTickets.forEach(ticket => {
        const row = document.createElement("article");
        row.className = "ticket";
        const details = document.createElement("div");
        const title = document.createElement("h3");
        title.textContent = ticket.title;
        const meta = document.createElement("p");
        meta.textContent = `Ticket #${ticket.id} · ${ticket.category} · Requested by ${ticket.requester}`;
        details.append(title, meta);
        const status = document.createElement("span");
        status.className = `status ${ticket.status === "Open" ? "status-open" : ticket.status === "In Progress" ? "status-progress" : "status-resolved"}`;
        status.textContent = ticket.status;
        const priority = document.createElement("span");
        priority.className = "priority";
        priority.textContent = ticket.priority;
        const action = document.createElement("button");
        action.className = "ticket-action";
        action.textContent = ticket.status === "Open" ? "Start Work" : ticket.status === "In Progress" ? "Resolve" : "Completed";
        action.disabled = ticket.status === "Resolved";
        action.addEventListener("click", () => updateTicketStatus(ticket, action));
        row.append(details, status, priority, action);
        ticketList.appendChild(row);
    });
    openCount.textContent = tickets.filter(ticket => ticket.status === "Open").length;
    progressCount.textContent = tickets.filter(ticket => ticket.status === "In Progress").length;
    resolvedCount.textContent = tickets.filter(ticket => ticket.status === "Resolved").length;
}

requestJson("/api/tickets")
    .then(data => { tickets = data; displayTickets(); })
    .catch(error => {
        ticketList.textContent = "Unable to load tickets.";
        showMessage(`Could not load tickets: ${error.message}`);
    });
