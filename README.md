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

The app uses the public SampleAPIs movie endpoints and does not need an API key. Its records include titles, poster links, and IMDb IDs; rating, year, and plot are shown when the source provides them. IMDb links open the source listing for more information.

## Deploy with Vercel

Import the GitHub repository into Vercel and keep the project root at the repository root. Use `npm run build` as the build command and `dist` as the output directory. Vercel serves the app's client-side movie routes directly.
