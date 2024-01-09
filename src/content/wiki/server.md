---
title: The Server behind dawdle.space
---

Dawdle.space currently runs on a single server with the following specs:

- 4 Ampere A1 cores (ARM64)
- 8GB RAM
- NVMe SSD
- 1Gbps uplink
- Hosted in Germany (Hetzer)

Users get their own container with 1GB RAM and 1 CPU core. The server runs Debian 11 (Bullseye) with the some additional packages installed, including:

- `micro` - A terminal text editor
- `git` - A version control system
- `zsh` - Our default shell

You can also install your own programs in your container, but keep in mind that your container will be shut down after 30 minutes of inactivity and files outside of your home directory will be deleted when we upgrade our server to newer versions of Debian.

Additionally, we have a few other tools like various static site generators installed, see `/usr/local/dawdle/bin`. These are updated by us regularly.
