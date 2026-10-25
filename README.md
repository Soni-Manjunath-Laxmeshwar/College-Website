# SKSVMACET campus website

## Run locally

Requires Node.js 18 or newer.

```bash
npm install
npm run dev
```

Open `http://localhost:5173/` for the React site. Open `http://localhost:4173/admin.html` to publish or remove homepage event updates while the API server is running with `npm start`.

For a production build, run `npm run build` and serve the generated `dist` folder behind the API server.

## Backend and database

- `server.js` serves the frontend and JSON API.
- `data/content.json` is the local content database. It stores hero banners and event cards.
- `GET /api/content` returns all homepage content.
- `GET /api/events` returns the event feed.
- `POST /api/events` publishes an event using `type`, `date`, `title`, `link`, and `action`.
- `DELETE /api/events/:id` removes an event.
- `PUT /api/content` updates content fields for future admin screens.

The JSON database keeps the first version dependency-free and is easy to migrate to MySQL, PostgreSQL, or SQLite when hosting requirements are known.
