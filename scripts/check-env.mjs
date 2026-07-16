import { validateRuntimeEnv } from "../config/env.js";

const result = validateRuntimeEnv();

if (!result.ok) {
  console.error("环境变量校验失败：");
  result.errors.forEach((error) => console.error(`- ${error}`));
  process.exit(1);
}

console.log("环境变量校验通过。");
