# Gallera — Next.js Photo Gallery

## Overview
Gallera is a Next.js-based photo gallery application. This repository contains the frontend and admin UI used to upload and browse albums. The app was built as a client project; use at your own risk.

**Disclaimer:** This was created for a client. Use the code and deploy it at your own risk — no guarantees, and you must verify credentials, API keys, and compliance for your environment.

## Tech stack
- Next.js 15
- React 19
- Tailwind CSS
- Firebase (for storage/auth as used in `src/lib/firebase.js`)
- Bunny (see `src/lib/bunny.js`)

## Project flow
- `app/` contains Next.js routes and server components.
- `src/components` contains React components for admin and gallery functionality.
- `src/lib` contains integrations (Firebase, Bunny CDN/Storage helpers).
- Admin pages under `app/admin` include login and album management.

## Docker (local container) — build and run
Build the image and run locally (production build):
```bash
docker build -t gallera:latest .
docker run -p 3000:3000 --env-file .env -e NEXT_PUBLIC_FIREBASE_API_KEY=$NEXT_PUBLIC_FIREBASE_API_KEY gallera:latest
```
Then open http://localhost:3000

Notes:
- Provide environment variables via an `.env` file or `--env` flags. Do not commit secrets.
- The Docker image runs `npm start` which serves the production Next.js server on port 3000.

## Deploying to Vercel
Vercel auto-detects Next.js projects. Quick steps:
1. Push your repository to GitHub/GitLab/Bitbucket.
2. Sign in to Vercel and create a new project, linking the repository.
3. Vercel will run `npm run build`. Ensure the following environment variables are set in the Vercel dashboard (same names as used locally):
   - `NEXT_PUBLIC_FIREBASE_API_KEY` (and other Firebase vars used)
4. Deploy. Vercel will provide a production URL.

If you prefer to use a Docker container for other hosts (DigitalOcean, AWS, etc.), use the provided `Dockerfile`.

## Environment variables
Keep the following (example) variables in `.env` or Vercel project settings:
- NEXT_PUBLIC_FIREBASE_API_KEY
- NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
- NEXT_PUBLIC_FIREBASE_PROJECT_ID
- SERVICE_ACCOUNT_KEY (if used server-side — keep secret)

## Useful scripts
- `npm run dev` — run development server
- `npm run build` — build for production
- `npm start` — start production server (used by Dockerfile)

## Next steps / Recommendations
- Verify Firebase rules before deploying to production.
- Rotate API keys if you accidentally commit them.
- Add runtime monitoring and error tracking for production.

## License & Ownership
This project was developed for a client. Check licensing and reuse permissions with the original client before using or redistributing.
This is a [Next.js] (https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
