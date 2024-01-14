---
title: Connecting with your Terminal using SSH
---

SSH, or Secure Shell, is a tool for securely connecting to remote computers.
You can use it to run commands on our server to do things like upload files or
install and run programs. We provide you with your own shell account with some
basic tools installed, but you can also install your own programs like static site generators or git to do more advanced things.

## How to connect to dawdle.space via SSH

To connect to dawdle.space via SSH, you will need an SSH client. If you are on
Linux or macOS, you probably already have one installed. If you are on Windows, you might have to eneable the OpenSSH client in the Windows Features menu. See [this guide](https://www.howtogeek.com/336775/how-to-enable-and-use-windows-10s-built-in-ssh-commands/) for more information.

Once you have an SSH client, you need to generate an SSH key. This is a pair of
files that you will use to identify yourself to the server. To generate an SSH
key, run the following command in your terminal:

```bash
$ ssh-keygen -t ed25519
```

Dawdle.space only supports `ed25519` keys, so make sure you use the `-t ed25519` option. You can leave the passphrase blank if you want.

Once you have generated your key, you need to add it to your account. To do
this, go to your [settings page](/user/settings) and paste the contents of the
`id_ed25519.pub` file into the "SSH Public Key" box. Then, click "Save Changes".

Now, you can connect to dawdle.space via SSH. To do this, run the following
command in your terminal:

```bash
$ ssh <username>@dawdle.space
```

Replace `<username>` with your username. If you are on Windows, you might have to use `ssh.exe` instead of `ssh`.

## VSCode Remote SSH

If you use VSCode, you can also use the [Remote SSH](https://code.visualstudio.com/docs/remote/ssh) extension to connect to dawdle.space. This allows you to edit files on the server directly from VSCode and use the terminal to run commands.

## Considerations

Once you have connected to dawdle.space via SSH, you will be in your own sandboxed container. Each container has 1GB of RAM, 1 CPU core, and can only access the internet via HTTP and HTTPS. To install programs, you will need to use the `apt` package manager and `sudo` to install them. More information about this can be found on Google and ChatGPT can also help you.

Additionally, by default, your container will be shut down after 30 minutes of inactivity. Keep important files in your home directory to prevent them from being deleted, as files outside of your home directory will be deleted when we upgrade our server to newer versions of Debian.

## SFTP

Currently, we do not support SFTP. The best way to upload files is to use scp, rsync or WebDAV, or the web interface.
