# Shortly

A simple, self-hosted URL shortener built with Node.js and Express.

## Run locally

```bash
npm install
npm start
```

Open `http://localhost:3000`, paste a long URL, and create a short link. Links are stored in `data/links.json` (ignored by Git so real link data is never committed).

## Deploying

Deploy to any Node.js host (for example Render, Railway, or a VPS). Set `PORT` if the host supplies one. For durable production links, replace the JSON store with a managed database and configure a custom domain.
