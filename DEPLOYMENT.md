# Deployment: Phase 11

The GitHub Actions workflow builds this repository and deploys `dist` to GitHub Pages on pushes to main or a manual run. In GitHub repository Settings > Pages, select GitHub Actions as the source first.

- Front-end URL: https://jojozainab.github.io/afterclass-frontend/
- API URL: https://m01140312-after-school.onrender.com
- Vite base: `/afterclass-frontend/` (also used by the local development server).
- Production API host: supplied through VITE_API_BASE_URL in the workflow build step.
- Local API host: defaults to http://localhost:3000 unless overridden in a local environment file.
- Render FRONTEND_ORIGIN: `https://jojozainab.github.io`, without a repository path or trailing slash.

Only the public API address is included in the Vue build. Atlas credentials belong exclusively in Render's server environment and the ignored local back-end .env file.

After pushing the workflow, inspect GitHub Actions for successful deployment. Then test all features on the public URL: catalogue and images, all sort combinations, server search, teacher filtering, cart removal and checkout. Check exactly one new Atlas order and correctly reduced availability after a production booking and refresh. Test all API routes in Postman using the Render host, including enrolment and missing-image handling, and inspect Render request logs. Check the phone-width layout. Deployment and regression checks remain pending until confirmed.
