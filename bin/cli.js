#!/usr/bin/env node
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { execSync } from "child_process";
import { styleText } from "util";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectName = process.argv[2] || "my-portfolio";

const templateDir = path.resolve(__dirname, "../template");
const targetDir = path.resolve(process.cwd(), projectName);

const env = process.env.NODE_ENV;

if (fs.existsSync(targetDir)) {
  console.error(`❌ Folder "${projectName}" already exists.`);
  process.exit(1);
}

fs.cpSync(templateDir, targetDir, { recursive: true });
// npm drops .gitignore from published packages, so the template ships it as "gitignore"
fs.renameSync(path.join(targetDir, "gitignore"), path.join(targetDir, ".gitignore"));
console.log(styleText("bgWhite", `✅ Project created in ./${projectName}`));

console.log(styleText("bgWhite", "📦 Installing dependencies..."));
execSync(`npm install`, {
  cwd: targetDir,
  stdio: "inherit",
});

const installer = `npm ${env === 'development' ? 'link' : 'install'} @lauvivans/kami`;

execSync(installer, {
  cwd: targetDir,
  stdio: "inherit",
});

console.log(styleText("yellow", "🚀 All ready! Run commands below:"));
console.log(styleText("yellow", `\n  cd ${projectName}`));
console.log(styleText("yellow", "  npm run dev\n"));
