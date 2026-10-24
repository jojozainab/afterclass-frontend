# Lesson catalogue: Phase 5

Start the back-end on port 3000, then run `npm run dev` in this repository. Open the printed URL, normally `http://localhost:5173`. If Vite uses a different port, adjust the back-end FRONTEND_ORIGIN to match and restart the back-end.

`src/services/api.js` calls GET `/lessons` using fetch and Promises, checking the HTTP status and array response. `App.vue` stores lessons, loading and error states in Vue refs, loads lessons on mount and renders reusable LessonCard components using `v-for` with `_id` as the key. Each card displays the subject, location, GBP price, spaces and an API-hosted image. Failed images have a text fallback.

For a different API host, copy `.env.example` to `.env`, update VITE_API_BASE_URL and restart Vite. This is public browser configuration; never put Atlas credentials or secrets in VITE variables.

## Manual checks

- Confirm 10 lesson cards with all required attributes and images.
- Confirm availability matches Atlas, including Phase 3 updates.
- Narrow the browser to phone width and check there is no horizontal scrolling.
- Use browser Network throttling and reload to observe the loading message.
- Stop the back-end and reload; check the connection error.
- Restart the back-end and click Try again; confirm recovery.
- Run `npm run build` to check the production bundle compiles.

The user confirmed the requested catalogue checks and production build passed. Sorting, cart and checkout are scheduled for later phases. The old starter stylesheet is no longer imported; `src/catalogue.css` styles the catalogue.
