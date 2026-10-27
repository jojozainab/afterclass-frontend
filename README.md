# AfterClass - Vue.js Front-end

**Student number:** M01140312

This repository contains the Vue.js front-end of my AfterClass coursework project. It provides the lesson catalogue and customer booking interface, with data supplied by the Express API.

## Project links

- Vue repository: https://github.com/jojozainab/afterclass-frontend
- Live application: https://jojozainab.github.io/afterclass-frontend/
- Express repository: https://github.com/jojozainab/afterclass-backend
- Live lessons endpoint: https://m01140312-after-school.onrender.com/lessons

## Features

The catalogue displays subject, location, GBP price, spaces and images using reusable lesson cards and `v-for`. Sorting supports all four attributes in either direction. Cart actions use `v-on`, update displayed availability and restore spaces on removal.

Checkout is part of the cart page. JavaScript validates letters-only names and digits-only phone numbers. Successful checkout saves an order through POST fetch and updates purchased lesson availability through PUT fetch. The interface includes loading, validation, success, failure and retry messages.

Search requests are processed by the back-end. Teacher selection narrows the displayed lessons without losing cart quantities. Clearing search or resetting both filters recovers the full catalogue.

## Local development

| Command           | Purpose                            |
| ----------------- | ---------------------------------- |
| `npm ci`          | Installs the locked dependencies   |
| `npm run dev`     | Starts the Vite development server |
| `npm run build`   | Builds the production bundle       |
| `npm run preview` | Previews the built bundle locally  |

The application path is `/afterclass-frontend/`. Local API requests default to `http://localhost:3000`; `VITE_API_BASE_URL` provides an optional override. This variable is public browser configuration and contains no database credentials.

## Deployment and testing

The GitHub Actions workflow builds and deploys the application to GitHub Pages on pushes to main. Its build uses the Render API address.

I tested the catalogue, all sorting combinations, cart behaviour, checkout, persistence, search, teacher filtering, responsive layouts and production builds. I also tested the deployed application against the Render API and Atlas database.

## Acknowledgement and limitations

I used ChatGPT for code generation in some sections, explanations, debugging and documentation. The final handbook-format declaration is part of the remaining submission preparation.

Cart contents and pending recovery are in memory. Order creation and availability updates use separate requests and do not provide atomic concurrent reservations.
