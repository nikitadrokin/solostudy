# Canvas MCP Server

A Model Context Protocol server providing access to Canvas LMS for AI assistants.

## Features

31 MCP tools covering:

- **Courses** — list and view course info
- **Assignments** — browse, view details, check/submit work
- **Grades** — per-course or across all courses
- **Messaging** — send/receive, manage conversations
- **Calendar** — events and upcoming deadlines
- **To-Do Lists** — pending tasks and assignments
- **Modules** — course content structure
- **Announcements** — course and institutional
- **Files** — access and download course materials
- **Quizzes** — view quizzes and submissions
- **Users** — search classmates and instructors

## Setup

### Prerequisites

- [Bun](https://bun.sh) runtime
- Canvas LMS account with API access token

### Canvas API Token

1. Log into Canvas → Account → Settings
2. Scroll to "Approved Integrations" → "+ New Access Token"
3. Copy the generated token

### Environment Variables

```bash
export CANVAS_BASE_URL="https://your-institution.instructure.com"
export CANVAS_ACCESS_TOKEN="your_access_token_here"
```

### MCP Client Config

```json
{
  "mcpServers": {
    "canvas": {
      "command": "bun",
      "args": ["run", "/absolute/path/to/canvas/src/index.ts"],
      "env": {
        "CANVAS_BASE_URL": "https://your-institution.instructure.com",
        "CANVAS_ACCESS_TOKEN": "your_access_token_here"
      }
    }
  }
}
```

## Docker / Poke Tunnel — Known Issues

### `localhost` inside the same container

Both `node dist/http.js` (the HTTP server on port 3001) and `poke tunnel` run inside the same container via supervisord. Because they share the same network namespace, `localhost` is valid and correct — `poke tunnel http://localhost:3001/mcp` will reach the server as expected. No change needed here.

### Poke credentials are not present in Docker

`poke login` stores credentials locally on your machine (typically in `~/.config/poke` or similar). The Docker container starts with no credentials, so `poke tunnel` will fail with an authentication error.

**Fix:** Copy your local poke credentials into the container image or mount them at runtime.

1. Find your local credentials:
```bash
ls ~/.config/poke
# or wherever poke stores its auth files
```

2. Mount them into the container at runtime:
```bash
docker run -v ~/.config/poke:/root/.config/poke <image>
```

Or copy them into the image at build time (only do this in a private/trusted environment — never commit credentials to a public repo):
```dockerfile
COPY --chown=root:root ./poke-credentials /root/.config/poke
```

### Internet access required

The container must have outbound internet access for `poke tunnel` to reach the poke relay servers. Ensure your Docker network configuration and any firewall rules allow outbound HTTPS traffic from the container.

## Security

- Store credentials in environment variables, never in source control
- Use token expiration dates and rotate tokens regularly
- Follow your institution's API usage policies
- Poke credentials mounted into Docker should be treated as secrets — use Docker secrets or a secrets manager in production
