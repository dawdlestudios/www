---
title: Using WebDav
---

WebDav is a protocol that allows you to access files on a remote server. It is
supported by most operating systems and can be used to access files on the
server.

The WebDav server is available at `https://dawdle.space/api/webdav/`. You can use your username and password to access it.

# Rclone (Cross-platform)

Rclone is a command-line tool that supports many different protocols, including
WebDav. You can download it [here](https://rclone.org/downloads/).

# Other Clients

## Windows

The built-in WebDav client in Windows is not very reliable.
[Cyberduck](https://cyberduck.io/) is a free client that works well. If you
want to use it like a local folder, they also have a paid product called
[Mountain Duck](https://mountainduck.io/).

## macOS

macOS has a built-in WebDav client. In your Finder, click `Go` and then `Connect to Server...`. Enter
`https://dawdle.space/api/webdav/` and click `Connect`. Enter your username and password.

## Linux

Most Linux distributions have a WebDav client built-in, add a new network drive called `davs://dawdle.space/api/webdav/` and enter your credentials. (Located somewhere in the file manager's menu, e.g. `Other Locations` -> `Enter Server Address` in Nautilus)
