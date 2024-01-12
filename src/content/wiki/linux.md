---
title: Linux Basics
---

## Overview

Linux, a powerful and versatile operating system, excels in its command line interface (CLI). The CLI allows efficient navigation, file manipulation, and system control.

To connect to the server, you will need an SSH client. See [Using SSH](/wiki/ssh) for more information.

## Common Commands

- `ls`: Lists directory contents.
- `cd [directory]`: Changes the current directory.
  - `cd ..`: Moves one directory up.
- `pwd`: Displays the current directory path.
- `mkdir [directory]`: Creates a new directory.
- `rmdir [directory]`: Removes a directory (must be empty).
- `touch [file]`: Creates a new, empty file.
- `rm [file]`: Deletes a file.
  - `rm -r [directory]`: Recursively deletes a directory and its contents.
- `cp [source] [destination]`: Copies files or directories.
  - `cp -r [dir1] [dir2]`: Recursively copies a directory.
- `mv [source] [destination]`: Moves or renames files or directories.
- `cat [file]`: Displays the contents of a file.
- `|`: Pipe. Redirects the output of one command to another.
- `>`, `>>`: Redirects output to a file. `>` overwrites, `>>` appends.
- `sudo [command]`: Executes a command with superuser privileges.
  - `sudo apt install [package]`: Installs a package.
  - `sudo apt remove [package]`: Removes a package.
  - `sudo apt update`: Updates the package list.
  - `sudo apt upgrade`: Upgrades all packages.
- `man [command]`: Displays the manual page for a command.
- `micro [file]`: Opens a file in the micro text editor.

## Tips

- Use Tab for auto-completion.
- Use Up/Down arrow keys to navigate command history.
- `Ctrl + C` to terminate a running command.
- `Ctrl + Z` to suspend a command.
- `Ctrl + L` to clear the screen.
