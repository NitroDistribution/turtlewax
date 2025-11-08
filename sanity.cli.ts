import { config as loadEnv } from "dotenv";
import { existsSync } from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";

import { defineCliConfig } from "sanity/cli";

const rootDir = process.cwd();

const loadEnvFile = (fileName: string, override = false) => {
  const filePath = path.join(rootDir, fileName);
  if (existsSync(filePath)) {
    loadEnv({ path: filePath, override });
  }
};

loadEnvFile(".env");
loadEnvFile(".env.local", true);

const require = createRequire(import.meta.url);
const { dataset, projectId } = require("./sanity/env");

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
  deployment: {
    appId: "t3y259g8drqqas18nbbig9w6",
  },
});
