# ⚡︎ @MODULE_NAME@

```
|:------------------------------------------------------:|
| ⚡︎ B o x L a n g ⚡︎
| Dynamic : Modular : Productive |
| :----------------------------: |
```

<blockquote>
	Copyright Since 2023 by Ortus Solutions, Corp
	<br>
	<a href="https://www.boxlang.io">www.boxlang.io</a> |
	<a href="https://www.ortussolutions.com">www.ortussolutions.com</a>
</blockquote>

<p>&nbsp;</p>

@MODULE_DESCRIPTION@

----

This template can be used to create Ortus based BoxLang Modules written in BoxLang. To use, just click the `Use this Template` button in the github repository: https://github.com/ortus-boxlang/boxlang-module-template-bx and run the setup task from where you cloned it.

```bash
boxlang SetupTemplate.bx
```

The `SetupTemplate` task will ask you for your module name, id and description and configure the template for you! Enjoy!

## Install Skills

If you are using the Copilot agent workflow with this template, restore the project skills from `skills-lock.json` when you first start working in the project:

```bash
npx skills experimental_install
```

Run the command from the project root so the workspace restores the pinned skills defined for this template.

## Directory Structure

Here is a brief overview of the directory structure:

- `.github/workflows` - These are the github actions to test and build the module via CI
- `.vscode` - VScode additions
- `bifs` - Where you can code Built in Functions for BoxLang
- `components` - Where you can code BoxLang components
- `interceptors` - Where you can code BoxLang interceptors
- `lib` - Place any Jar's or classes for your module that will be class loaded for you
- `.cfformat.json` - A format config using the Ortus Standards
- `.editorconfig` - Smooth consistency between editors
- `.gitattributes` - Git attributes
- `.gitignore` - Basic ignores. Modify as needed.
- `.markdownlint.json` - A linting file for markdown docs
- `box.json` - The box.json for your module used to publish to ForgeBox
- `changelog.md` - A nice changelog tracking file
- `CONTRIBUTING.md` - A contribution guideline
- `ModuleConfig.bx` - Your module's configuration file
- `readme.md` - Your module's readme. Modify as needed.

## Local Building

The `Build.bx` is used to package your module so it can be distributed to FORGEBOX or to a friend.  It will create a zip file in the `build` directory with the name of your module and the version number.  The zip file will contain all the files needed to run your module, including the `box.json` file, the `ModuleConfig.bx` file, and any other files you have in your module.

If you want to build the module, you can use `boxlang Build.bx` to build the module.  Here are the options you can pass to the script:

| Option    | Required | Default Value    | Description                        |
| --------- | -------- | ---------------- | ---------------------------------- |
| `version` | No       | `1.0.0`          | The version of the module.         |
| `branch`  | No       | `development`    | The branch being built.            |
| `buildId` | No       | UUID (generated) | A unique identifier for the build. |

```bash
boxlang Build.bx --version=1.1.0
```

## Running Tests

1. With CommandBox installed, install testbox: `box install`
2. With the Boxlang CLI installed, run tests using `./testbox/run`

## Version Management

This module uses [SemVer](https://semver.org/) for versioning.  The version is stored in the `box.json` file and is used to publish to FORGEBOX and the GithubActions will atuomatically bump it for you.  The version is also used to tag the repo for releases.

## Github Actions Automation

This repo has all kinds of automation for PRs, snapshots, tests and releases.  Use them as you see fit.
If you will be doing FORGEBOX publishing, then you will need to set up a FORGEBOX API key in the secrets of your repository.

- `FORGEBOX_API_TOKEN` - This is your FORGEBOX API key. You can get it from your FORGEBOX account settings.  This is used to publish to FORGEBOX.

## Ortus Sponsors

BoxLang is a professional open-source project and it is completely funded by the [community](https://patreon.com/ortussolutions) and [Ortus Solutions, Corp](https://www.ortussolutions.com). Ortus Patreons get many benefits like a cfcasts account, a FORGEBOX Pro account and so much more. If you are interested in becoming a sponsor, please visit our patronage page: [https://patreon.com/ortussolutions](https://patreon.com/ortussolutions)

### THE DAILY BREAD

> "I am the way, and the truth, and the life; no one comes to the Father, but by me (JESUS)" Jn 14:1-12
