# Zatsudan(雑談) 💬

[![Live Demo](https://img.shields.io/badge/Live_Demo-zatsudan--deploy.pages.dev-blue)](https://zatsudan-deploy.pages.dev/)

A single-room global anonymous chatbox featuring real-time messaging and persistent chat logs.

## Overview

Zatsudan allows users to jump into a global chat without accounts or friction. The frontend is edge-hosted on Cloudflare Pages for instant load times, connecting directly to a Node.js WebSocket backend (My pc) to broadcast messages globally in real-time.

## Tech Stack

- **Frontend:** Vanilla TypeScript, HTML, CSS, [Vite](https://vitejs.dev/)
- **Backend:** Node.js, WebSockets (`ws`), SQLite (`better-sqlite3`)
- **Infrastructure:** [Cloudflare Pages](https://pages.cloudflare.com/) (Frontend Hosting), `cloudflared` Quick Tunnels (Backend Routing)

## Roadmap

- [ ] **Deployment:** Implement an automated GitHub Actions CI/CD pipeline targeting the `zatsudan-deploy` frontend repository (currently private and not in use).
- [ ] **Frontend Overhaul:** Refactor the UI/UX using React for better state management and component structure.
- [ ] **Scalability:** Upgrade the backend architecture to support multi-room chatboxes for distinct topics.
- [ ] **Moderation:** Implement an IP-based temporary ban system for platform violators.

## Notice

By using Zatsudan, you agree to the [Terms of Service and Community Guidelines](https://github.com/Denma14/Zatsudan/blob/master/Terms.md).
