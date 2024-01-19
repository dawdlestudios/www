---
title: Uploading Files with rsync
---

rsync is a tool for synchronizing files between two locations. It's pretty easy to use and does uploads and downloads very quickly (it only uploads the files that have changed).

## How to upload files with rsync

To upload files with rsync, you need to have an SSH key set up. See [Connecting with your Terminal using SSH](/wiki/guide/ssh) for more information.
For the following examples, we will assume that you have rsync installed (your dawdle.space container comes with it preinstalled) and an SSH key set up and a `.ssh/config` file with the following contents:

```ssh-config
Host dawdle
    HostName dawdle.space
    User <username>
    IdentityFile ~/.ssh/id_ed25519
```

To upload files, you can run the following command in your terminal:

```bash
$ rsync -avzP dist/ dawdle:~/public
# -a: archive mode (recursive, preserves permissions, etc.)
# -v: verbose (show what is being uploaded)
# -z: compress files during transfer
# -P: show progress
```

This will upload the contents of the `dist` folder to your `public` folder on dawdle.space. You can replace `dist/` with the path to any folder on your computer.

For dawdle.space itself we use a script with a similar command to deploy the site:

`deploy.sh`:

```bash
#!/usr/bin/env bash

bun run build
rsync -avzP dist/ dawdle:~/sites/dawdle.space
```

And to deploy it, we run `./deploy.sh` in our terminal and changes are live within seconds.
