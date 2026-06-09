import "dotenv/config";
import { createApp } from "./app.js";

const aiMode = process.env.AI_MODE ?? "mock";
if (aiMode !== "mock") {
  throw new Error(
    "AI_MODE must remain 'mock' until club operators approve API usage.",
  );
}

const port = Number(process.env.PORT ?? 4000);
createApp().listen(port, () => {
  console.log(`PhiloType backend listening on http://localhost:${port}`);
  console.log("AI mode: mock (external API calls are disabled)");
});
