import { execSync } from "child_process";
// DATABASE_URL já está no process.env via --env-file=.env.local
execSync("npx prisma db push", { stdio: "inherit", env: process.env });
