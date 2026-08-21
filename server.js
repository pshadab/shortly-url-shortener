const crypto = require("crypto");
const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, "data", "links.json");

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

function getLinks() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
  } catch {
    return {};
  }
}

function saveLinks(links) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(links, null, 2));
}

function makeCode() {
  return crypto.randomBytes(4).toString("base64url");
}

app.post("/api/links", (req, res) => {
  let { url, code } = req.body;
  try {
    const parsed = new URL(url);
    if (!["http:", "https:"].includes(parsed.protocol)) throw new Error();
  } catch {
    return res.status(400).json({ error: "Enter a valid http or https URL." });
  }

  if (code && !/^[a-zA-Z0-9_-]{3,30}$/.test(code)) {
    return res.status(400).json({ error: "Custom code must be 3–30 letters, numbers, hyphens, or underscores." });
  }

  const links = getLinks();
  code = code || makeCode();
  while (links[code]) code = makeCode();
  links[code] = { url, createdAt: new Date().toISOString(), clicks: 0 };
  saveLinks(links);
  res.status(201).json({ code, shortUrl: `${req.protocol}://${req.get("host")}/s/${code}` });
});

app.get("/api/links", (_req, res) => res.json(getLinks()));

app.get("/s/:code", (req, res) => {
  const links = getLinks();
  const link = links[req.params.code];
  if (!link) return res.status(404).send("Short link not found.");
  link.clicks += 1;
  saveLinks(links);
  res.redirect(302, link.url);
});

app.listen(PORT, () => console.log(`Shortly is running at http://localhost:${PORT}`));
