# Copilot Instructions for CoreView

## Architecture Overview
- **Flask backend** in `/backend`: `app.py` defines REST endpoints and session-based auth using the `login_required` decorator. Time utilities live in `/backend/commands/info.py`.
- **Next.js 15 frontend** in `/core-view-frontend`: App Router under `src/app`; shared UI components in `src/components`; React contexts in `src/contexts`; API wrappers in `src/lib/api.ts`.

## Setup & Local Development

### Backend
1. Create a `.env` file in `/backend` with:
   ```env
   ADMIN_USERNAME=your_username
   ADMIN_PASSWORD=your_password
   ```
2. Install Python dependencies:
   ```bash
   pip install flask flask-cors python-dotenv
   ```
3. Start the server:
   ```bash
   python backend/app.py
   ```

### Frontend
1. Install Node dependencies:
   ```bash
   cd core-view-frontend
   npm install
   ```
2. Start the dev server:
   ```bash
   npm run dev
   ```

*Tip:* Run `./start.sh` from repo root to launch both services via the venv and npm scripts.

## Key Code Patterns & Conventions

- **Authentication**
  - Decorator `login_required` (in `app.py`) guards all service routes.
  - Session secret and lifetime are set in `app.py` (5-minute expiry).
  - `USERS` map is loaded at startup via `dotenv.load_dotenv()`.

- **API Client**
  - `src/lib/api.ts` exports `authAPI` and `coreAPI` using an axios instance:
    - `baseURL` points to `http://localhost:5001`
    - `withCredentials: true` and global 401 interceptor (redirect to `/login`).

- **Protected UI Routes**
  - `AuthGuard` in `src/components/AuthGuard.tsx` wraps pages requiring login.
  - Client-side redirect logic lives in `AuthGuard` with Next.js `useRouter`.

- **File Naming**
  - Next.js pages use `page.tsx` (and optional `layout.tsx`) in each route folder.
  - Reusable components live under `src/components/ui`;
  - Utilities in `src/lib`, contexts under `src/contexts`.

## Common Commands & Workflows

- **Launching both services**: `./start.sh` (background processes, traps Ctrl+C).
- **Backend debug mode**: `python backend/app.py --debug` (auto-reload).
- **Environment Activation**: `/backend/venv/bin/activate` (used by `start.sh`).

## Integration & External Dependencies

- **CORS**
  - Configured in `app.py` to allow `localhost:3000`, `8080`, and `127.0.0.1` origins.

- **Session Cookies**
  - Axios `withCredentials` must match Flask CORS `supports_credentials=True`.

## Next Steps & Feedback
Please review these instructions for accuracy. If any critical developer steps, conventions, or file references are missing or unclear, let me know and I will update this document accordingly.
