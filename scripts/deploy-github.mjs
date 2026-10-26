import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const cwd = fileURLToPath(new URL("../", import.meta.url));
const git = (args, capture = false) => {
  const result = spawnSync("git", args, {
    cwd,
    encoding: "utf8",
    stdio: capture ? "pipe" : "inherit",
  });
  if (result.status !== 0) {
    if (capture && result.stderr) process.stderr.write(result.stderr);
    throw new Error(`git ${args[0]} failed; publication stopped.`);
  }
  return result.stdout?.trim();
};

try {
  if (git(["branch", "--show-current"], true) !== "master")
    throw new Error("Run this release from the master branch.");
  const remote = git(["remote", "get-url", "--push", "origin"], true);
  if (
    ![
      "git@github.com:m-esm/m-esm.github.io.git",
      "ssh://git@github.com/m-esm/m-esm.github.io.git",
    ].includes(remote)
  )
    throw new Error("Origin must point to m-esm/m-esm.github.io over SSH.");

  // Keep any separately staged work out of this visual release.
  if (git(["diff", "--cached", "--name-only"], true))
    throw new Error(
      "Commit or unstage existing staged changes before releasing.",
    );
  const build = spawnSync("npm", ["run", "build"], { cwd, stdio: "inherit" });
  if (build.status !== 0) throw new Error("Build failed; publication stopped.");

  git(["fetch", "origin", "master"]);
  git([
    "add",
    "--",
    ".github/workflows/pages.yml",
    ".gitignore",
    ".nvmrc",
    "README.md",
    "docs",
    "index.html",
    "package.json",
    "package-lock.json",
    "playwright.config.ts",
    "public",
    "scripts",
    "src",
    "tests",
    "tsconfig.json",
    "vite.config.ts",
  ]);
  if (git(["diff", "--cached", "--name-only"], true))
    git([
      "commit",
      "-m",
      "Polish orbital habitat, planet and engineering settlement",
    ]);
  const beforeMerge = git(["rev-parse", "HEAD"], true);
  git(["merge", "--no-edit", "origin/master"]);
  if (git(["rev-parse", "HEAD"], true) !== beforeMerge) {
    const mergedBuild = spawnSync("npm", ["run", "build"], {
      cwd,
      stdio: "inherit",
    });
    if (mergedBuild.status !== 0)
      throw new Error("Merged build failed; publication stopped.");
  }
  git(["push", "origin", "HEAD:refs/heads/master"]);
  console.log("Pushed master over SSH. GitHub Pages will build and deploy:");
  console.log(
    "https://github.com/m-esm/m-esm.github.io/actions/workflows/pages.yml",
  );
  console.log("Public target: https://m-esm.github.io/");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
