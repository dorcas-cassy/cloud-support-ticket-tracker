const newTicketButton = document.getElementById("new-ticket-button");
const cancelButton = document.getElementById("cancel-button");
const ticketFormSection = document.getElementById("ticket-form-section");
const ticketForm = document.getElementById("ticket-form");
const ticketList = document.getElementById("ticket-list");
const statusFilter = document.getElementById("status-filter");

const openCount = document.getElementById("open-count");
const progressCount = document.getElementById("progress-count");
const resolvedCount = document.getElementById("resolved-count");

let tickets = [
    {
        id: 1001,
        title: "Unable to connect to office Wi-Fi",
        requester: "Maya Chen",
        category: "Network",
        priority: "High",
        status: "Open"
    },
    {
        id: 1002,
        title: "Password reset for finance portal",
        requester: "Jonas Weber",
        category: "Account",
        priority: "Medium",
        status: "In Progress"
    },
    {
        id: 1003,
        title: "Microsoft Teams microphone not detected",
        requester: "Amina Yusuf",
        category: "Software",
        priority: "Low",
        status: "Resolved"
    }
];

newTicketButton.addEventListener("click", function () {
    ticketFormSection.classList.remove("hidden");
});

cancelButton.addEventListener("click", function () {
    ticketFormSection.classList.add("hidden");
    ticketForm.reset();
});

ticketForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const newTicket = {
        id: Date.now(),
        title: document.getElementById("title").value,
        requester: document.getElementById("requester").value,
        category: document.getElementById("category").value,
        priority: document.getElementById("priority").value,
        status: "Open"
    };

    tickets.unshift(newTicket);

    ticketForm.reset();
    ticketFormSection.classList.add("hidden");
    statusFilter.value = "All";

    displayTickets();
});

statusFilter.addEventListener("change", function () {
    displayTickets();
});

function updateTicketStatus(ticketId) {
    const ticket = tickets.find(function (item) {
        return item.id === ticketId;
    });

    if (ticket.status === "Open") {
        ticket.status = "In Progress";
    } else if (ticket.status === "In Progress") {
        ticket.status = "Resolved";
    }

    displayTickets();
}

function getStatusClass(status) {
    if (status === "Open") {
        return "status-open";
    }

    if (status === "In Progress") {
        return "status-progress";
    }

    return "status-resolved";
}

function updateSummary() {
    openCount.textContent = tickets.filter(function (ticket) {
        return ticket.status === "Open";
    }).length;

    progressCount.textContent = tickets.filter(function (ticket) {
        return ticket.status === "In Progress";
    }).length;

    resolvedCount.textContent = tickets.filter(function (ticket) {
        return ticket.status === "Resolved";
    }).length;
}

function displayTickets() {
    const selectedStatus = statusFilter.value;

    const filteredTickets = tickets.filter(function (ticket) {
        return selectedStatus === "All" || ticket.status === selectedStatus;
    });

    ticketList.innerHTML = "";

    if (filteredTickets.length === 0) {
        ticketList.innerHTML = `
            <p id="empty-message">
                No support tickets found in this category.
            </p>
        `;
    }

    filteredTickets.forEach(function (ticket) {
        const ticketElement = document.createElement("article");

        ticketElement.classList.add("ticket");

        let actionText = "Completed";

        if (ticket.status === "Open") {
            actionText = "Start Work";
        } else if (ticket.status === "In Progress") {
            actionText = "Resolve";
        }

        ticketElement.innerHTML = `
            <div>
                <h3>${ticket.title}</h3>

                <p>
                    Ticket #${ticket.id} · ${ticket.category}
                    · Requested by ${ticket.requester}
                </p>
            </div>

            <span class="status ${getStatusClass(ticket.status)}">
                ${ticket.status}
            </span>

            <span class="priority">
                ${ticket.priority}
            </span>

            <button
                class="ticket-action"
                ${ticket.status === "Resolved" ? "disabled" : ""}
                onclick="updateTicketStatus(${ticket.id})"
            >
                ${actionText}
            </button>
        `;

        ticketList.appendChild(ticketElement);
    });

    updateSummary();
}

displayTickets();