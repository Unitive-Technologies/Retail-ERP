import express from "express";
import fs from "fs";
import path from "path";
import cors from "cors";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3030;

app.use(cors());
app.use(express.json());

const dbPath = path.join(__dirname, "db.json");
const routesPath = path.join(__dirname, "routes.json");
function getDatabase() {
    return JSON.parse(fs.readFileSync(dbPath, "utf-8"));
}
const routes = JSON.parse(fs.readFileSync(routesPath, "utf-8"));

// Dynamic routing based on routes.json
Object.entries(routes).forEach(([customRoute, dbKey]) => {
    app.get(customRoute, (req, res) => {
        const db = getDatabase();
        if (db[dbKey.replace("/", "")]) {
            res.json(db[dbKey.replace("/", "")]);
        } else {
            res.status(404).json({ error: "Not found" });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});