---
title: Creating a Website with Zola
---

So you want to create a more complex website than just a few HTML files, like a blog or a portfolio? Great! This guide will show you how to get started.

## Static Site Generators

We'll be using a static site generator called [Zola](https://www.getzola.org/) to create our website and blog. A static site generator is a program that takes a bunch of files and turns them into a website. It's a bit like a compiler for websites.

There are a lot of different static site generators out there, but we chose Zola because it's fast, easy to use, and has some nice themes to choose from.

## Creating a Blog

First, we need to create a new Zola site. We'll do this connected to dawdle.space, since zola is already installed there, but you can also do it on your own computer. See [Installing Zola](https://www.getzola.org/documentation/getting-started/installation/) for more information.

First, connect to dawdle.space using SSH (see [Connecting to dawdle.space](/wiki/guide/ssh) for more information).

Now, run the following command to create a new Zola site:

```bash
$ zola init website
```

This will ask you a few questions, but you can just press enter to use the default values for now.

This will create a new folder called `website` with a few files in it. Let's take a look at them:

```bash
$ cd website # Change into the folder
$ ls # List the files
```

## Themes

There's a bunch of themes available for Zola, but we'll use one called `Bear` for now. If you want to change it later, you can find a list of themes [here](https://www.getzola.org/themes/).

To use the `Bear` theme, we'll first need to download it:

```bash
$ git clone https://codeberg.org/alanpearce/zola-bearblog themes/bear
```

And we'll also copy the content files from the theme into our site to have some example posts:

```bash
cp -r themes/bear/content/* ./content
```

Now, we'll need to change some settings in the `config.toml` file. Open it with `micro`:

```bash
$ micro config.toml # Open the config file
```

Change it to look like this (lines starting with `#` are comments and can be ignored):

```toml
# Replace <username> with your username
base_url = "https://<username>.dawdle.space"

# Use the bear theme we just downloaded
theme = "bear"

taxonomies = [
  {name = "categories", feed = true},
  {name = "tags", feed = true},
]

# Since we're running this on dawdle.space,
# we can set this up to save the generated files
# directly to the public folder.
# This will overwrite any files you already have there
# so be sure to back them up first
output_dir = "../public"

title = "My Site"
description = "My awesome site"

[extra]
# if you want to hide the "Made with Zola" line at the bottom of your site,
hide_made_with_line=true

# This will add links to the main menu
[[extra.main_menu]]
name = "My twitter"
url = "https://twitter.com/my-twitter"

# Add a new sub-page to your site
[[extra.main_menu]]
name = "Zola"
url = "@/zola.md"

[[extra.main_menu]]
name = "Blog"
url = "@/blog/_index.md"
```

If you only want this to make a site in a subfolder, be sure to change the `output_dir` to something like `../public/blog` and change the `base_url` to `https://<username>.dawdle.space/blog`.

## Building the Site

Everytime we make a change to our site, we'll need to build it again. This will take all the files in the `content` folder and turn them into HTML files in the `public` folder.

To build the site, run the following command:

```bash
$ zola build
```

Finally, your site is online! You can visit it at `https://<username>.dawdle.space`.

Now, you can edit the files in the `content` folder to change the pages and add new posts. When you're done, run `zola build` again to update your site.

More information about configuring your site can be found in the [Zola documentation](https://www.getzola.org/documentation/getting-started/configuration/) and configuring the theme can be found in the [Bear documentation](https://codeberg.org/alanpearce/zola-bearblog/src/branch/main/README.md).
