import { env } from "./config/env.js";
import { app } from "./app.js";
import { initializeDatabase } from "./config/database.js";

async function bootstrap() {
  await initializeDatabase();

  app.listen(env.PORT, () => {
    console.log(`API running on port ${env.PORT}`);
  });
}

bootstrap().catch((error) => {
  console.error("Failed to start API:", error.message);
  process.exit(1);
});
