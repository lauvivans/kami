# 003 · Branching workflow

- **Date:** 2026-11-20
- **Origin:** spike [#87](https://github.com/lauvivans/kami/issues/87), after the Dependabot setup in [#57](https://github.com/lauvivans/kami/issues/57)
- **Status:** accepted

## Question

Which branching workflow does Kami follow: the git flow it used until now (`develop` plus `release/<version>` branches into `main`) or a simpler model?

## Short answer

- **GitHub flow.** `main` is the only long-lived branch. Each change goes in a short-lived branch named `<type>/<issue>-kebab-case-name`, opened as a pull request into `main` and squash-merged.
- **Every merge can release.** semantic-release runs on `main` and publishes a version when a merged commit is a `fix` (patch), a `feat` (minor) or a breaking change (major). `chore`, `docs`, `test`, `ci` and `refactor` merges don't publish.
- **The pull request title picks the version.** The squash commit takes the PR title, so the title must follow Conventional Commits.
- **Staging is the pull request preview.** Cloudflare Pages builds a preview of the site for each pull request. `main` deploys production.
- **Extra branches only when needed.** A `next` branch can publish prereleases to the `next` channel on npm, for a change that needs testing before it reaches `latest`. A maintenance branch such as `1.x` can publish fixes for an older major. Neither exists until it is needed.

## Why

Options compared: git flow, GitHub flow, trunk-based development, GitLab flow (environment branches), release branches and the forking workflow.

- **GitHub treats only the default branch as the base.** Dependabot security updates always open against the default branch, even when `target-branch` is set, and closing keywords such as `Closes #12` only work in pull requests into the default branch. With `develop` as the base, security fixes skipped the normal flow and issues stayed open until a release. With `main` as the only base, both work as GitHub intends.
- **Releases are already automated.** semantic-release picks the version from the commits and publishes on its own. The release branch, the merge commit and the merge of `main` back into `develop` were manual steps on top of that, with no check that a reviewer could not also do on the pull request.
- **The pull request preview covers staging.** A preview of the site is built for every pull request, so a separate `develop` deploy adds nothing a reviewer can't already see.
- **Trunk-based development** needs feature flags for unfinished work and fits teams that merge many times a day. Kami's changes are small enough to land whole in one pull request.
- **GitLab flow** keeps a `production` branch to sync with `main`, which is one more manual merge per release for the same result.
- **Release branches and forks combine with GitHub flow.** semantic-release supports maintenance branches (`1.x`) natively, and pull requests from forks target `main` like any other.

## Consequences

- `develop` is retired after its last release to `main`. CI runs on pull requests into `main`, and Dependabot drops `target-branch`.
- `Closes #<issue>` closes the issue when its pull request is merged. The board loses the "In staging" status: a merged pull request moves the issue to **Done**.
- Changes can't be batched into one release. Each `fix` or `feat` merged becomes a version on npm, so related changes that must ship together go in the same pull request, or in a `next` branch.
- A wrong PR title publishes a wrong version, or none. CI should check that PR titles follow Conventional Commits.
- Pull requests from forks get no Pages preview and no repository secrets. A maintainer checks those changes locally before merging.
