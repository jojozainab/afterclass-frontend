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

During Phase 6, no bookings were saved. The Phase 7 checkout below now persists orders and availability; an unsubmitted cart still resets on reload.

## Phase 7: checkout integration

CheckoutForm lives in the cart page. JavaScript regular expressions validate ASCII letters-only names and digits-only phone strings; the visible Checkout button is disabled until valid inputs and a nonempty cart are present. App repeats validation before submitting. No payment information is collected.

Checkout reads fresh availability, POSTs one order, then sends PUT requests setting absolute spaces for each purchased lesson. It clears the cart only after all updates succeed and displays the order reference. Edits and navigation are disabled during submission. HTTP error responses are checked explicitly by the fetch helper.

If POST succeeds but a PUT fails, the saved order and remaining updates stay in memory. Complete booking retries the updates without a second POST. Keep the page open during recovery. If the POST outcome is unknown after a network error or server error, checkout is locked to avoid a blind duplicate submission; inspect Atlas before taking further action. Pending recovery state does not survive a page reload. The separate POST/PUT design is not atomic and does not prevent concurrent bookings from overwriting availability; this remains a limitation of the current implementation.

Verification: the user confirmed successful checkout, exactly one new Atlas order, reduced availability, an empty cart, persistence after refresh and a passing production build. A lost-response order during an API interruption was reconciled manually with PUT requests before retesting successfully. The partial PUT retry path below remains a separate regression check.

Manual checks:

- Blank inputs, names containing digits and phone numbers containing letters keep Checkout disabled. A valid alphabetic name and digit string enable it for a nonempty cart.
- Submit a small order spanning two lessons. Confirm exactly one new Atlas order with matching quantities, and each lesson's spaces decrease by the purchased quantity.
- Confirm a success reference, empty cart and persisted availability after refreshing.
- Stop the API before checkout: confirm an error without a new order, restart it and retry successfully.
- To exercise partial recovery, use browser request blocking to block one `/lessons/<id>` URL used by PUT. Submit once; check the saved-order message. Unblock it and select Complete booking; check completion and that the order count increased only once. Do not refresh during this test.
- Check the narrow-screen cart and run `npm run build`.

Manual checks (user confirmed all passed, including the production build):

- Check all eight combinations of four sort attributes and two directions.
- Add the same lesson until spaces reach zero; confirm the visible button becomes disabled and no additional spaces can be added.
- Add multiple different lessons and inspect their quantities and totals in the cart.
- Remove one space; check the restored availability and re-enabled Add button.
- Remove all items; check the empty message, Back to lessons navigation and disabled empty cart access afterward.
- Check sorting by spaces after additions/removals, narrow-screen layouts and `npm run build`.
