---
title: Contribute
order: 2.3
icon: phosphor-duotone:git-pull-request
summary: Report bugs, ask questions, submit pull requests, or support the project financially.
tags: [about, contributing]
---

# Contribute

BxSites is open source, and the maintainers give their free time to build
and maintain it. Please be considerate towards maintainers when raising
issues or presenting pull requests - we all follow the Golden Rule: do to
others as you want them to do to you.

## Code of Conduct

As contributors and maintainers of this project, we pledge to respect all
people who contribute through reporting issues, posting feature requests,
updating documentation, submitting pull requests or patches, and other
activities.

- Participants will be tolerant of opposing views.
- Examples of unacceptable behavior by participants include the use of
  sexual language or imagery, derogatory comments or personal attacks,
  trolling, public or private harassment, insults, or other unprofessional
  conduct.
- Project maintainers have the right and responsibility to remove, edit, or
  reject comments, commits, code, wiki edits, issues, and other
  contributions that are not aligned with this Code of Conduct.
- When interpreting the words and actions of others, participants should
  always assume good intentions.
- Instances of abusive, harassing, or otherwise unacceptable behavior may
  be reported by opening an issue or contacting one or more of the project
  maintainers.

## Bug reporting

BoxLang tracks its own issues in Jira; each module - including this one -
tracks its issues in its own GitHub repository.

::: cards
::: card title="BoxLang Jira" icon="phosphor-duotone:kanban" href="https://ortussolutions.atlassian.net/browse/BL/issues"
For issues in the BoxLang runtime itself.
:::
::: card title="bx-sites Issues" icon="phosphor-duotone:bug" href="https://github.com/ortus-boxlang/bx-sites/issues"
For issues in this module.
:::
:::

A good bug report has a title, a clear description of the issue, a way to
replicate it, and any support files needed to reproduce it. Issues that
don't include a way to reproduce them won't be addressed.

## Support questions

If you have a usage question, want professional support, or just want to
bounce an idea off the maintainers, please don't open an issue for it -
use one of the support channels below instead:

::: cards
::: card title="Ortus Community Discourse" icon="phosphor-duotone:chats-circle" href="https://community.ortussolutions.com"
Ask questions and browse existing discussions.
:::
::: card title="Box Slack Team" icon="phosphor-duotone:slack-logo" href="https://boxteam.slack.com"
Chat in real time with the community and maintainers.
:::
::: card title="Professional Support" icon="phosphor-duotone:headset" href="https://www.ortussolutions.com/services/support"
Paid support plans from Ortus Solutions.
:::
:::

## Pull request guidelines

- The `main`/`master` branch is a snapshot of the latest stable release -
  all development happens on dedicated branches, and PRs against it are
  closed. Send pull requests against the `development` branch instead.
- It's fine to have several small commits while you work - they're
  squashed automatically before merging.
- Make sure local tests pass, and include tests alongside your changes.
- Link the relevant Jira/GitHub issue in your PR title when you send it.

## Security vulnerabilities

Found a security vulnerability? Please don't open a public issue for it.
Email the development team at
[security@ortussolutions.com](mailto:security@ortussolutions.com?subject=security)
and report it in the `#security` channel of the Box Team Slack. All
security vulnerabilities are addressed promptly.

## Development setup

Clone the repository, install dependencies with `box install`, and see the
[readme's collaboration section](https://github.com/ortus-boxlang/bx-sites#running-tests)
for the full local development and test-running setup. JDK 21+ is
required.

## Coding styles

This project follows the Ortus coding standards, with formatter configs
included for both BoxLang/CFML and Java code:

```bash frame="terminal" title="Terminal"
# Format everything
box run-script format

# Start a watcher - auto-formats on save
box run-script format:watch
```

See the [Ortus coding standards](https://github.com/Ortus-Solutions/coding-standards)
for the full reference.

## Financial contributions

You can support BxSites, BoxLang, and all of Ortus Solutions' open-source
initiatives by becoming a sponsor on Patreon - sponsors also get perks like
a cfcasts account, a ForgeBox Pro account, and more, depending on the tier.

<div class="bxsites-hero__actions">
	<a class="bxsites-hero__btn bxsites-hero__btn--primary" href="https://www.patreon.com/c/ortussolutions">Become a sponsor on Patreon</a>
	<a class="bxsites-hero__btn bxsites-hero__btn--secondary" href="https://www.paypal.com/paypalme/ortussolutions">One-time donation via PayPal</a>
</div>

## Contributors

Thank you to everyone who has already contributed to BxSites - we love you!

<a href="https://github.com/ortus-boxlang/bx-sites/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=ortus-boxlang/bx-sites" alt="BxSites contributors">
</a>
