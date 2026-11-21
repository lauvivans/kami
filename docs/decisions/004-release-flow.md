# 004 · Release flow

- **Date:** 2026-11-20
- **Origin:** spike [#132](https://github.com/lauvivans/kami/issues/132)
- **Status:** accepted
- **Supersedes:** the release parts of decisions 001 (semantic-release) and 003 (every merge can release)

## Question

Should Kami stop publishing a version on every `fix`/`feat` merge and batch changes into a Release PR? If so, which tool should open that PR?

## Short answer

- **Batch releases in a Release PR, opened by release-please** ([`googleapis/release-please-action`](https://github.com/googleapis/release-please-action)). It keeps one open pull request with the next version and its changelog, and updates it on every merge into `main`. Merging that pull request tags the version and creates the GitHub release.
- **The Conventional Commits rules stay.** release-please reads the same squash commits that semantic-release reads today. PR titles, the `pr-title.yml` check and the version rules (`fix`/`perf` patch, `feat` minor, `!` major) don't change.
- **npm publishing stays in `release.yml`.** A publish step runs `npm stage publish` with trusted publishing (#104) only when release-please reports a release. The trusted publisher only accepts staged publishes, so a maintainer approves each version with 2FA on npmjs.com before it goes live. The workflow keeps its file name, so the trusted publisher configured on npm keeps matching.
- **The Release PR is opened with a GitHub App token**, so the required checks run on it.
- **semantic-release is removed.**

## Why

v2.0.0 to v2.0.8 came out on 2026-11-20, nine versions in one day, mostly from small fixes and template dependency updates merged one after the other. Each one reached every portfolio that runs `npm update`, and there was no place to see what the next version would contain before it went out.

Options compared:

- **release-please** reads the Conventional Commits on `main`, so it needs nothing new from contributors or from Dependabot. The Release PR shows the next version and the changelog before anything is published, and merging it is the release.
- **changesets** ([`changesets/action`](https://github.com/changesets/action)) asks every pull request to add a `.changeset/*.md` file with the bump type and a hand-written note. Kami already picks the bump from the PR title and checks it in CI, so the PR would carry two sources for the same decision, and they can disagree. Dependabot pull requests don't add changesets, so template updates, which ship inside the package, would need a changeset added by hand before they reach a release. changesets fits monorepos with many packages better, and Kami publishes one.
- **Keep semantic-release.** It has no Release PR. The only way to batch is to hold merges back, or to merge into a `next` branch and publish prereleases, which brings back a second long-lived branch that decision 003 removed.

## Consequences

- **`package.json` holds the real version.** The Release PR bumps `version` and prepends the notes to `CHANGELOG.md`. It is merged like any other pull request, so nothing pushes to `main` directly. `package.json` starts from `2.0.8` and `.release-please-manifest.json` records it.
- **`CHANGELOG.md` is written again,** from the first release-please version on. Its header note changes to say that 2.0.0 to 2.0.8 are only on the GitHub releases page.
- **The release is a decision.** A `fix` merged into `main` waits in the Release PR until a maintainer merges it. An urgent fix, such as a security patch, is released by merging the Release PR right after the fix.
- **A GitHub App opens the Release PR.** Events created with the default `GITHUB_TOKEN` don't start new workflow runs, so a Release PR opened with it would never get the required checks and could not be merged. The release workflow creates a short-lived token with [`actions/create-github-app-token`](https://github.com/actions/create-github-app-token), from a GitHub App installed only on this repository with contents and pull requests write access. Its ID and private key are repository secrets. A fine-grained personal token would also work, but it expires and is tied to one person's account.
- **The Release PR title follows Conventional Commits.** release-please titles it `chore(main): release <version>`, which the `pr-title.yml` check accepts, and a `chore` commit doesn't start another release.
- **Prereleases and maintenance branches** (decision 003) are set up in the release-please config when one is needed, instead of the semantic-release `branches` option.
- **Dependencies:** `semantic-release` and its plugins leave the lockfile, and release-please runs as an action with no npm dependency in the project.
- The release parts of `CLAUDE.md`, decision 001, decision 003 and the Developer docs release page are updated by the implementation pull request.
