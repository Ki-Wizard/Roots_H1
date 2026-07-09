import { fileURLToPath } from "node:url";
import { config } from "dotenv";
import { createApp } from "./app.js";

config({ path: fileURLToPath(new URL("../../.env", import.meta.url)) });

const aiMode = process.env.AI_MODE ?? "mock";
const port = Number(process.env.PORT ?? 4000);
createApp().listen(port, () => {
  console.log(`PhiloType backend listening on http://localhost:${port}`);
  console.log(`AI mode: ${aiMode}`);
});
