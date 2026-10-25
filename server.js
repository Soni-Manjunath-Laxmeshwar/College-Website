import http from "node:http";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { existsSync, createReadStream } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const distRoot = path.join(root, "dist");
const publicRoot = existsSync(path.join(distRoot, "index.html")) ? distRoot : root;
const dbDir = path.join(root, "data");
const dbFile = path.join(dbDir, "content.json");
const port = Number(process.env.PORT || 4173);

const defaultContent = {
  slides: [
    { kicker: "Admissions · 2026–27", title: "Build a future<br><em>that moves India.</em>", copy: "An education that puts curiosity in motion, connects learning to the real world, and gives every ambition room to grow.", primary: "Explore admissions", primaryLink: "#admissions", secondary: "Discover programmes", secondaryLink: "#programmes", image: "https://agadiengcollege.com/wp-content/uploads/2023/10/cse1.jpg" },
    { kicker: "Campus bulletin", title: "Big ideas deserve<br><em>a bigger stage.</em>", copy: "Follow the people, projects, competitions and conversations shaping life across our campus.", primary: "View latest updates", primaryLink: "#events", secondary: "Explore campus life", secondaryLink: "#campus", image: "https://agadiengcollege.com/wp-content/uploads/2023/10/eee2.jpg" },
    { kicker: "Learn · Make · Lead", title: "Engineering minds<br><em>for what’s next.</em>", copy: "With focused mentoring and a practical learning culture, students are ready to create impact from the very beginning.", primary: "Find your programme", primaryLink: "#programmes", secondary: "Why SKSVMACET", secondaryLink: "#about", image: "https://agadiengcollege.com/wp-content/uploads/2023/10/ise1.jpg" }
  ],
  events: [
    { id: "admissions-2026", type: "Admissions", date: "2026–27", title: "Take the first step towards an engineering career.", link: "#admissions", action: "Explore admissions" },
    { id: "campus-updates", type: "Campus updates", date: "New", title: "Every achievement, event and notice in one place.", link: "#all-updates", action: "See all updates" },
    { id: "student-life", type: "Student life", date: "Discover", title: "Make more of your college experience, every day.", link: "#campus", action: "Explore campus life" }
  ],
  updatedAt: new Date().toISOString()
};

async function ensureDb() {
  await mkdir(dbDir, { recursive: true });
  if (!existsSync(dbFile)) return writeFile(dbFile, JSON.stringify(defaultContent, null, 2));
  try {
    const current = JSON.parse(await readFile(dbFile, "utf8"));
    if (!Array.isArray(current.slides) || !Array.isArray(current.events)) {
      await writeFile(dbFile, JSON.stringify(defaultContent, null, 2));
    }
  } catch {
    await writeFile(dbFile, JSON.stringify(defaultContent, null, 2));
  }
}

async function readContent() {
  await ensureDb();
  try { return JSON.parse(await readFile(dbFile, "utf8")); }
  catch { return defaultContent; }
}

async function saveContent(content) {
  const next = { ...content, updatedAt: new Date().toISOString() };
  await writeFile(dbFile, JSON.stringify(next, null, 2));
  return next;
}

function sendJson(res, status, payload) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", "Cache-Control": "no-store", "Access-Control-Allow-Origin": "*" });
  res.end(JSON.stringify(payload));
}

function safeFilePath(urlPath) {
  const pathname = decodeURIComponent(urlPath.split("?")[0]);
  const requested = pathname === "/" ? "/index.html" : pathname;
  const resolved = path.resolve(publicRoot, `.${requested}`);
  return resolved.startsWith(path.resolve(publicRoot)) ? resolved : null;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === "OPTIONS") {
      res.writeHead(204, { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Methods": "GET,POST,PUT,DELETE,OPTIONS", "Access-Control-Allow-Headers": "Content-Type" });
      return res.end();
    }
    if (req.url === "/api/content" && req.method === "GET") return sendJson(res, 200, await readContent());
    if (req.url === "/api/events" && req.method === "GET") return sendJson(res, 200, (await readContent()).events);

    if (req.url === "/api/events" && req.method === "POST") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      const body = JSON.parse(raw || "{}");
      if (!body.title || !body.type || !body.date) return sendJson(res, 400, { error: "type, date and title are required" });
      const content = await readContent();
      const event = { id: body.id || `event-${Date.now()}`, type: body.type, date: body.date, title: body.title, link: body.link || "#events", action: body.action || "Read more" };
      content.events = [event, ...content.events.filter((item) => item.id !== event.id)];
      return sendJson(res, 201, await saveContent(content));
    }

    if (req.url?.startsWith("/api/events/") && req.method === "DELETE") {
      const id = decodeURIComponent(req.url.split("/").pop());
      const content = await readContent();
      const before = content.events.length;
      content.events = content.events.filter((item) => item.id !== id);
      return sendJson(res, before === content.events.length ? 404 : 200, await saveContent(content));
    }

    if (req.url === "/api/content" && req.method === "PUT") {
      let raw = "";
      for await (const chunk of req) raw += chunk;
      const update = JSON.parse(raw || "{}");
      const current = await readContent();
      return sendJson(res, 200, await saveContent({ ...current, ...update }));
    }

    if (req.method !== "GET") return sendJson(res, 405, { error: "Method not allowed" });
    const filePath = safeFilePath(req.url || "/");
    if (!filePath || !existsSync(filePath)) {
      if (req.headers.accept?.includes("text/html")) {
        return createReadStream(path.join(publicRoot, "index.html")).pipe(res);
      }
      return sendJson(res, 404, { error: "Not found" });
    }
    const ext = path.extname(filePath).toLowerCase();
    const type = { ".html": "text/html", ".css": "text/css", ".js": "text/javascript", ".json": "application/json", ".svg": "image/svg+xml" }[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": `${type}; charset=utf-8` });
    createReadStream(filePath).pipe(res);
  } catch (error) {
    console.error(error);
    sendJson(res, 500, { error: "Internal server error" });
  }
});

await ensureDb();
server.listen(port, () => console.log(`SKSVMACET site running at http://localhost:${port}`));
