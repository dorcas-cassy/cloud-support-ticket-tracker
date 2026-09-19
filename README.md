# Cloud Support Ticket Tracker

A small IT support queue built with Express and plain HTML, CSS, and JavaScript. Create tickets, filter by status, and move them from Open to In Progress to Resolved. Ticket data is saved on the server, so browser refreshes and container restarts keep changes.

![Application dashboard](screenshots/application-dashboard.png)

## Features

- Create tickets with a requester, category, and priority.
- Track open, in-progress, and resolved totals; filter the queue by status.
- Advance tickets through the support workflow.
- Keep tickets in a JSON file, including across Docker container restarts.

## Run with Docker

Requires Docker with the Compose plugin running. From the project directory:

```bash
docker compose up --build -d
```

Open <http://localhost:3000>. Check the container and follow its logs with:

```bash
docker compose ps
docker compose logs -f app
```

Compose stores tickets in the `tickets_data` named volume. `docker compose down` stops the app and keeps the data. **`docker compose down -v` deletes the volume and all saved tickets.**

To use another host port, run `PORT=8080 docker compose up --build -d` and open <http://localhost:8080>. The container still listens on port 3000.

## Run without Docker

Requires Node.js 22 or newer.

```bash
npm ci
npm start
```

Open <http://localhost:3000>. Tickets are stored in `data/tickets.json`; this directory is ignored by Git. Set `DATA_FILE` to use a different JSON file, or `PORT` to change the listening port. Run the API tests with:

```bash
npm test
```

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/api/tickets` | List tickets |
| POST | `/api/tickets` | Create a ticket |
| PATCH | `/api/tickets/:id/status` | Move a ticket to the next status |

Create requests need a JSON body with `title`, `requester`, `category` (`Network`, `Account`, `Software`, or `Hardware`), and `priority` (`Low`, `Medium`, or `High`). The app starts with three example tickets when the data file is first created.

Example request:

```bash
curl -X POST http://localhost:3000/api/tickets \
  -H 'Content-Type: application/json' \
  -d '{"title":"VPN connection fails","requester":"Alex Kim","category":"Network","priority":"High"}'
```

Check service health with `curl http://localhost:3000/health`. To move a ticket forward, send `PATCH /api/tickets/1004/status` (replace `1004` with its ID).

The JSON file is intended for a single app instance. If you need multiple replicas or authenticated multiuser access, use a database and add authentication before exposing it publicly.
