---
title: Building, Deploying & Publishing
summary: Ship the site you've built - to any host, or straight to bxSites Cloud.
icon: phosphor-duotone:rocket-launch
tags: [course]
---

# Building, Deploying & Publishing

Back to where [lesson 3](03-creating-a-new-site.md) started:

```bash title="Terminal"
bxSites build
```

`site/` is now a complete, static, hostable folder - plain files, no
runtime dependency on bx-sites or BoxLang at all once it's built. Ship
it however you like.

## Deploy to a real target

```bash title="Terminal"
bxSites deploy
```

One command, over a dozen targets: S3 (and any S3-compatible service -
DigitalOcean Spaces, Cloudflare R2, Backblaze B2, MinIO), Azure Blob
Storage, Google Cloud Storage, Firebase Hosting, FTP, SFTP, rsync,
Netlify, Vercel, Cloudflare Pages, GitHub Pages, or a local directory.
Each target is a `deployments/<name>.json` file - `bxSites deploy` with
no flags runs every one of them, off a single shared build.

## Publish to bxSites Cloud

```bash title="Terminal"
bxSites publish
```

Ships straight to [bxSites Cloud](https://bxsites.io), the hosting
service this project itself targets - no target config needed beyond a
`cloud.siteId` in `bxsites.yaml` and an API token in an environment
variable.

## Or just a zip

```bash title="Terminal"
bxSites package
```

Bundles the built site into one distributable `site.zip`, for a release
artifact or a host that only accepts a zip upload.

## That's the course

Twenty lessons, start to finish - install, author, theme, extend, ship.
Everything here has a full guide behind it for when you need more depth
than a lesson gives; the [Guides](../guides/index.md) section is where
to go next.

Full deploy target reference: [Deployment](../guides/deployment.md).
