import "dotenv/config";

import app from "./http/app";
import { runSeed } from "./utils/seed";

runSeed();

const PORT = process.env.PORT ?? 3333;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
