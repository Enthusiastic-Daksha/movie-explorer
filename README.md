# CineVerse Movie Explorer

Browse five animated movies, search by title, and open a movie page for an IMDb link.

## Run locally

```sh
npm install
npm run dev
```

## Checks

```sh
npm run lint
npm run build
```

## Movie data

The app uses the public SampleAPIs animation endpoint and does not need an API key. It provides movie titles, posters, and IMDb IDs. Category labels and displayed IMDb ratings are kept in the app for the five selected films; ratings can change over time. IMDb links open each movie's listing.

## Deploy with Vercel

Import the GitHub repository into Vercel and keep the project root at the repository root. Use `npm run build` as the build command and `dist` as the output directory. Vercel serves the app's client-side movie routes directly.
