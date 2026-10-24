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

The user confirmed the Phase 5 catalogue checks and production build passed. The old starter stylesheet is no longer imported; `src/catalogue.css` styles the catalogue.

## Phase 6: sorting and cart

SortControls selects topic (labelled Subject), location, price or spaces in either direction. A computed property sorts a copy of the lesson array; numeric fields use subtraction and text fields use localeCompare.

App owns the cart quantities and the displayed lesson availability. LessonCard emits an add event using v-on; App adds one space and decrements availability, guarding against zero. ShoppingCart lists each lesson with its quantity and emits remove events that restore one available space. Totals and the cart badge are computed. The navigation button is initially disabled and stays usable as Back to lessons if the final item is removed while viewing the cart.

No bookings are saved during Phase 6. Reloading resets the cart and reloads Atlas availability. Checkout will be added in Phase 7.

Manual checks (user confirmed all passed, including the production build):

- Check all eight combinations of four sort attributes and two directions.
- Add the same lesson until spaces reach zero; confirm the visible button becomes disabled and no additional spaces can be added.
- Add multiple different lessons and inspect their quantities and totals in the cart.
- Remove one space; check the restored availability and re-enabled Add button.
- Remove all items; check the empty message, Back to lessons navigation and disabled empty cart access afterward.
- Check sorting by spaces after additions/removals, narrow-screen layouts and `npm run build`.
